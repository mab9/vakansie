package ch.mab.vakansie.groups;

import ch.mab.vakansie.base.BaseModel;
import ch.mab.vakansie.users.User;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.DiscriminatorColumn;
import javax.persistence.Entity;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;

@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")  // https://www.baeldung.com/jackson-bidirectional-relationships-and-infinite-recursion
@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE) // default strategy
@DiscriminatorColumn
@Table(name = "Groups")  // the table name group, is a reserved key word for h2 databae
public abstract class Group extends BaseModel {

    // owner side of the relationship
    @JoinTable(name = "user_group",
        joinColumns = @JoinColumn(name = "group_id"),   // to change name of
        inverseJoinColumns = @JoinColumn(name = "user_id")  // the join table
    )
    @ManyToMany(cascade = CascadeType.ALL)
    private final Set<User> users = new HashSet<>();

    @Column(nullable = false)
    private String name;

    @OneToMany(cascade = CascadeType.ALL)
    private Set<Policy> policies = new HashSet<>();

    @ManyToOne(optional = false, cascade = CascadeType.ALL)
    private User owner;

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
    }

    public User getOwner() {
        return owner;
    }

    public void setOwner(User owner) {
        this.owner = owner;
    }

    public Set<Policy> getPolicies() {
        return policies;
    }

    public void setPolicies(Set<Policy> policies) {
        this.policies = policies;
    }
}
