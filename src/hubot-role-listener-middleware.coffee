# Description
#   Hubot script to manage user roles for each hubot listener
#
# Configuration:
#   LIST_OF_ENV_VARS_TO_SET
#
# Commands:
#   hubot hello - <what the respond trigger does>
#   orly - <what the hear trigger does>
#
# Notes:
#   <optional notes required for the script>
#
# Author:
#   Yoanm <yoanm@users.noreply.github.com>

RoleChecker = require './model/RoleChecker'
middleware = require './utils/middleware'


roleUpdateListenerOptions = {
  role: RoleChecker.ROLE_ADMIN_ROLE,
};


module.exports = (robot) ->
  robot.roleChecker = new RoleChecker;

  robot.listenerMiddleware (context, next, done) ->
    middleware(robot, context, next, done);

  # Notify bot in case he want to populate roles at startup;
  robot.emit 'role-checker.populate';

  robot.respond new RegExp('add "(?<role>[^"]+)" role to @(?<username>[^\s|\t]+)'), roleUpdateListenerOptions, (res) ->
    res.finish();
    {role, username} = res.match.groups;
    user = robot.roleChecker.getHelpers().findUserInMentions username, res.message.mentions;
    if !user || !user.id
      robot.roleChecker.getHelpers().replyUserNotFoundForUsername res, username;
    else
      robot.roleChecker.getHelpers().addRoleAndNotify(robot, user, role, res);


  robot.respond new RegExp('remove "(?<role>[^"]+)" role from @(?<username>[^\s|\t]+)'), roleUpdateListenerOptions, (res) ->
    res.finish();
    {role, username} = res.match.groups;
    user = robot.roleChecker.getHelpers().findUserInMentions username, res.message.mentions;
    if !user || !user.id
      robot.roleChecker.getHelpers().replyUserNotFoundForUsername res, username;
    else
      robot.roleChecker.getHelpers().removeRoleAndNotify(robot, user, role, res);


  robot.respond new RegExp('give me "(?<role>[^"]+)" role'), roleUpdateListenerOptions, (res) ->
    res.finish();
    {role} = res.match.groups;
    user = res.message?.user || null;
    if !user || !user.id
      robot.roleChecker.getHelpers().replyCurrentUserNotFound(res);
    else
      robot.roleChecker.getHelpers().addRoleAndNotify(robot, user, role, res);


  robot.respond new RegExp('take back "(?<role>[^"]+)" role'), roleUpdateListenerOptions, (res) ->
    res.finish();
    {role} = res.match.groups;
    user = res.message?.user || null;
    if !user || !user.id
      robot.roleChecker.getHelpers().replyCurrentUserNotFound(res);
    else
      robot.roleChecker.getHelpers().removeRoleAndNotify(robot, user, role, res);


  robot.respond new RegExp('show roles for @(?<username>[^\s|\t]+)'), (res) ->
    res.finish();
    username = res.match.groups?.username || null;
    user = robot.roleChecker.getHelpers().findUserInMentions(username, res.message.mentions);
    if !user || !user.id
      robot.roleChecker.getHelpers().replyUserNotFoundForUsername res, username;
    else
      robot.roleChecker.getHelpers().sendRoleListFor(robot, user, res.envelope.room);

  robot.respond /show my roles/, (res) ->
    res.finish();
    user = res.message?.user || null;
    if !user || !user.id
      robot.roleChecker.getHelpers().replyCurrentUserNotFound(res);
    else
      robot.roleChecker.getHelpers().sendRoleListFor(robot, user, res.envelope.room);



