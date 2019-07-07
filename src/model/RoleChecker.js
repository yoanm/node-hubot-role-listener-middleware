'use strict';

const helpers = require('./helpers');

class RoleChecker {

    static ROLE_ADMIN_ROLE = 'ROLE_ADMIN';

    constructor() {
        this.roleListByUser = [];
    }

    setDefaultRequiredRole(defaultRequiredRole) {
        this.defaultRequiredRole = defaultRequiredRole;
    }

    getDefaultRequiredRole() {
        return this.defaultRequiredRole;
    }

    addUserRole(userId, role) {
        if (!this.roleListByUser[userId]) {
            this.roleListByUser[userId] = [];
        }

        this.roleListByUser[userId].push(role);
    }

    removeUserRole(userId, role) {
        this.roleListByUser[userId] = this.getUserRoles(userId)
            .filter(item => (role !== item));
    }

    getUserRoles(userId) {
        return this.roleListByUser[userId] || [];
    }

    userHasRole(userId, role) {
        return this.getUserRoles(userId).includes(role);
    }

    /**
     * @publux
     * @returns {{removeRoleAndNotify, replyUserNotFoundForUsername, addRoleAndNotify, replyCurrentUserNotFound, findUserInMentions, sendRoleListFor}|*}
     */
    getHelpers() {
        return helpers;
    }
}

module.exports = RoleChecker;
