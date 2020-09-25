package ch.mab.vakansie.groups;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

@Entity
@DiscriminatorValue("Space")
public class GroupSpace extends Group {

    public GroupSpace() {
    }
}
