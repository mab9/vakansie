package ch.mab.vakansie.groups;

import ch.mab.vakansie.base.BaseModel;
import ch.mab.vakansie.users.User;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.Column;
import javax.persistence.DiscriminatorColumn;
import javax.persistence.Entity;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.ManyToMany;
import javax.persistence.Table;

@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")  // https://www.baeldung.com/jackson-bidirectional-relationships-and-infinite-recursion
@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE) // default strategy
@DiscriminatorColumn
@Table(name = "Groups")  // the table name group, is a reserved key word for h2 databae
public class Group extends BaseModel implements Serializable { // Serializable is not required, this way  the object may be passed across  process boundaries{

    @ManyToMany(mappedBy = "groups")  // User is the owner of the relationship
    private final Set<User> users = new HashSet<>();

    @Column(nullable = false)
    private String name;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<User> getUsers() {
        return users;
    }

    public void addUser(User user) {
        users.add(user);
        user.addToGroup(this);
    }
}
