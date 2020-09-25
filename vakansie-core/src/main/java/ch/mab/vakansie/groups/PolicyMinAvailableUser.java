package ch.mab.vakansie.groups;

import javax.persistence.Column;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

@Entity
@DiscriminatorValue("MinAvailableUser")
public class PolicyMinAvailableUser extends Policy {

    @Column
    private int minUsers = 0; // if default (0), then the field will not be validated at rule validation time.

    public int getMinUsers() {
        return minUsers;
    }

    public void setMinUsers(int minUsers) {
        this.minUsers = minUsers;
    }
}
