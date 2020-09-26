package ch.mab.vakansie.policies;

import javax.persistence.Basic;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

@Entity
@DiscriminatorValue("MinAvailableUser")
public class PolicyMinAvailableUser extends Policy {

    @Basic
    private int minUsers = 0;

    public int getMinUsers() {
        return minUsers;
    }

    public void setMinUsers(int minUsers) {
        this.minUsers = minUsers;
    }
}
