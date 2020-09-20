package ch.mab.vakansie.groups;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

@Entity
@DiscriminatorValue("Project")
public class GroupProject extends Group {

    public GroupProject() {}
}
