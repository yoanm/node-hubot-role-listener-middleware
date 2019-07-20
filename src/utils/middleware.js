'use strict';

const userHasRoles = (robot, response, user, requiredRoleList, listenerIdentifier) => {
    if (!user || !user.id) {
        robot.logger.error(`[Role checker] Unable to retrieve the user to check role for ${listenerIdentifier}`);

        return false;
    }

    for (const key in requiredRoleList) {
        const requiredRole = requiredRoleList[key];
        if (!robot.roleChecker.userHasRole(user.id, requiredRole)) {
            response.reply(`:no_entry: Access Denied. You need "${requiredRole}" role to perform this action.`);
            robot.logger.error(`[Role checker] Listener ${listenerIdentifier} => missing "${requiredRole}" role for #${user.id} user !`);

            return false;
        }
    }

    return true;
};

module.exports = (robot, context, next, done) => {
    const {listener = {}, response = {}} = context;
    const {options: {role: requiredRole = null, disableRoleChecker = false}, regex: listenerRegex = undefined} = listener;
    const {message: {user = {}} = {}} = response;

    // Will be used in two places but better to do it ONLY if useful
    const computeListenerIdentifier = () => {
        return (listener.options && listener.options.id)
            ? listener.options.id
            : JSON.stringify({options: listener.options, regex: (listenerRegex && listenerRegex.toString())})
            ;
    };

    try {
        if (disableRoleChecker !== true) {
            const requiredRoleList = [];
            if (robot.roleChecker.getDefaultRequiredRole()) {
                requiredRoleList.push(robot.roleChecker.getDefaultRequiredRole());
            }
            if (!!(requiredRole)) {
                requiredRoleList.push(requiredRole);
            }
            if (requiredRoleList.length) {
                const listenerIdentifier = computeListenerIdentifier();
                robot.logger.debug(`[Role checker] start checking listener "${listenerIdentifier}" with roles: ${JSON.stringify(requiredRoleList)}`);
                if (!userHasRoles(robot, response, user, requiredRoleList, listenerIdentifier)) {
                    done();
                    return;
                }
                robot.logger.debug('[Role checker] Check successful');
            }
        } else {
            robot.logger.debug(`[Role checker] disabled by option for listener "${computeListenerIdentifier()}"`);
        }
        next();
    } catch (error) {
        done();
        robot.logger.error('[Role checker] An error occured !', {error});
        robot.emit('error', error, response);
    }
};
