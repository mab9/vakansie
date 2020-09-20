package ch.mab.vakansie.groups;

import ch.mab.vakansie.users.User;
import java.util.Set;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

@Entity
@DiscriminatorValue("Team")
public class GroupTeam extends Group {

    public GroupTeam() {}
}
