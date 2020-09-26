package ch.mab.vakansie.policies;

import ch.mab.vakansie.users.User;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.Column;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.persistence.OneToMany;

/*
    Define minimum user availability of a set of users.
    Rule will not be validated if minNoOFPoliciedUsers is set to default (0).
 */
@Entity
@DiscriminatorValue("MinAvailableUserOfDefinedGroup")
public class PolicyMinAvailableUserOfDefinedGroup extends Policy {

    @OneToMany // uni directional, there is no mapped or inverse relationship definition on the user entity
    private Set<User> userGroup = new HashSet<>();

    @Column
    private int minAvailableUsers = 0;

    public Set<User> getUserGroup() {
        return userGroup;
    }

    public void setUserGroup(Set<User> userGroup) {
        this.userGroup = userGroup;
    }

    public int getMinAvailableUsers() {
        return minAvailableUsers;
    }

    public void setMinAvailableUsers(int minAvailableUsers) {
        this.minAvailableUsers = minAvailableUsers;
    }
}
