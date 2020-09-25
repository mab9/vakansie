package ch.mab.vakansie.groups;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

@Entity
@DiscriminatorValue("Team")
public class GroupTeam extends Group {

    public GroupTeam() {
    }
}
