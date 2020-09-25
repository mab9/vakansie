package ch.mab.vakansie.users;

import ch.mab.vakansie.base.BaseModel;
import ch.mab.vakansie.groups.Group;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;
import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.ManyToMany;

@Entity
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")  // https://www.baeldung.com/jackson-bidirectional-relationships-and-infinite-recursion
public class User extends BaseModel implements Serializable { // Serializable is not required, this way  the object may be passed across  process boundaries

    @ManyToMany(mappedBy = "users")  // group is the owner of the relationship
    private final Set<Group> groups = new HashSet<>();

    @Basic
    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    @Enumerated(EnumType.STRING)
    private Permissions permission = Permissions.USER; // default permission

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

    public Permissions getPermission() {
        return permission;
    }

    public void setPermission(Permissions permission) {
        this.permission = permission;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        if (!super.equals(o)) {
            return false;
        }
        User user = (User) o;
        return Objects.equals(name, user.name) &&
            email.equals(user.email) &&
            permission == user.permission;
    }

    @Override
    public int hashCode() {
        return Objects.hash(super.hashCode(), name, email, permission);
    }
}
