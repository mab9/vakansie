package ch.mab.vakansie;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.comparesEqualTo;
import static org.hamcrest.Matchers.contains;
import static org.hamcrest.Matchers.empty;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;

import ch.mab.vakansie.groups.Group;
import ch.mab.vakansie.groups.GroupRepository;
import ch.mab.vakansie.users.User;
import ch.mab.vakansie.users.UserRepository;
import ch.mab.vakansie.util.TestUtil;
import java.util.Optional;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

@DataJpaTest
public class GroupRepositoryTest extends TestUtil {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private GroupRepository groupRepository;

    @Autowired
    private EntityManager entityManager;

    @Test
    public void createGroup() {
        Group group = createProject("SVV");
        Group groupPersisted = groupRepository.save(group);

        assertThat(groupPersisted, notNullValue());
        assertThat(groupPersisted.getId(), notNullValue());
        assertThat(groupPersisted.getName(), comparesEqualTo(group.getName()));
        assertThat(groupPersisted.getUsers(), empty());
    }

    @Test
    public void createGroup_withUser_fromOwnerSide() {
        User user = createUser("mab");
        User userPersisted = userRepository.save(user);

        Group group = createProject("SVV");
        group.addUser(userPersisted);
        Group groupPersisted = groupRepository.save(group);

        assertThat(groupPersisted.getId(), notNullValue());
        assertThat(groupPersisted.getUsers(), contains(userPersisted));

        entityManager.flush();

        Optional<Group> currentGroup = groupRepository.findById(groupPersisted.getId());
        assertThat(currentGroup.get().getUsers(), contains(userPersisted));
    }

    @Test
    public void createGroup_withUser_cascade_fromOwnerSide() {
        User user = createUser("mab");

        Group group = createProject("SVV");
        group.addUser(user);
        Group groupPersisted = groupRepository.save(group);

        assertThat(groupPersisted.getId(), notNullValue());
        assertThat(groupPersisted.getUsers(), contains(user));

        entityManager.flush();

        Optional<Group> currentGroup = groupRepository.findById(groupPersisted.getId());
        assertThat(currentGroup.get().getUsers(), contains(user));

    }
}
