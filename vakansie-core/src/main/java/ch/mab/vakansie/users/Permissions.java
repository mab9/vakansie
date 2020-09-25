package ch.mab.vakansie.users;

public enum Permissions {

    ADMIN_MAIN,
    ADMIN_GROUP,     // group admin
    USER_PRIVILEGED, // group user, secondary of the group admin
    USER;            // group user
}
