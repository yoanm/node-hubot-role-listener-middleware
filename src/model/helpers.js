'use strict';

const sendRoleListFor = function (robot, user, room) {
    const rolelist = robot.roleChecker.getUserRoles(user.id);
    const messageOptions = {
        as_user: true, // Send it as bot user instead of app user
        link_names: 1, // Translate '<@XXXX>' into '@user' mention
    };
    if (0 === rolelist.length) {
        messageOptions.text = `:information_source: User <@${user.id}> have no role !`;
    } else {
        messageOptions.attachments = [{pretext: `:information_source: Roles for <@${user.id}> :`}];
        messageOptions.attachments = messageOptions.attachments.concat(
            rolelist.map(role => {
                const message = '`' + role + '`';
                return {
                    fallback: message,
                    color: '#1b48a6',
                    text: message
                }
            })
        );
    }
    robot.send({room, user}, messageOptions);
};

const findUserInMentions = (username, mentions) => {
    const {info: user = {}} = mentions
        .filter(mention => (mention && mention.info && mention.info.name === username))
        .shift()
    || {};

    return user;
};

const addRoleAndNotify = function (robot, user, role, res) {
    robot.roleChecker.addUserRole(user.id, role);
    res.reply(`:information_source: Role "${role}" added to <@${user.id}> !`)
};

const removeRoleAndNotify = function (robot, user, role, res) {
    robot.roleChecker.removeUserRole(user.id, role);
    res.reply(`:information_source: Role "${role}" removed from <@${user.id}> !`)
};

const replyUserNotFoundForUsername = (res, username) => res.reply(`:x: Argh, I'm unable to retrieve the user "${username}" !`);
const replyCurrentUserNotFound = (res) => res.reply(`:x: Argh, I'm unable to retrieve your user !`);

module.exports = {
    sendRoleListFor,
    findUserInMentions,
    addRoleAndNotify,
    removeRoleAndNotify,
    replyUserNotFoundForUsername,
    replyCurrentUserNotFound,
};
