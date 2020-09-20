package ch.mab.vakansie.users;

import ch.mab.vakansie.base.BaseModel;
import ch.mab.vakansie.groups.Group;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.Basic;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import org.hibernate.annotations.Cascade;
import org.hibernate.annotations.CascadeType;

@Entity
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")  // https://www.baeldung.com/jackson-bidirectional-relationships-and-infinite-recursion
public class User extends BaseModel implements Serializable { // Serializable is not required, this way  the object may be passed across  process boundaries

    @Basic
    private String name;

    @Basic(optional = false)
    private String email;

    @JoinTable(name = "user_group",
        joinColumns = @JoinColumn(name = "user_id"),   // to change name of
        inverseJoinColumns = @JoinColumn(name = "group_id")  // the join table
    )
    @ManyToMany
    @Cascade(CascadeType.ALL)
    private Set<Group> groups = new HashSet<>();

    public User() {
    }

    public Set<Group> getGroups() {
        return groups;
    }

    public void addToGroup(Group group) {
        groups.add(group);
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

}
