package ch.mab.vakansie;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.comparesEqualTo;
import static org.hamcrest.Matchers.contains;
import static org.hamcrest.Matchers.empty;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.not;
import static org.hamcrest.Matchers.notNullValue;

import ch.mab.vakansie.groups.Group;
import ch.mab.vakansie.groups.GroupRepository;
import ch.mab.vakansie.policies.Policy;
import ch.mab.vakansie.policies.PolicyMinAvailableUser;
import ch.mab.vakansie.policies.PolicyMinAvailableUserOfDefinedGroup;
import ch.mab.vakansie.policies.PolicyRepository;
import ch.mab.vakansie.users.User;
import ch.mab.vakansie.users.UserRepository;
import ch.mab.vakansie.util.TestUtil;
import java.util.Arrays;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.Disabled;
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
    private PolicyRepository policyRepository;

    @Test
    public void createGroup() {
        Group group = createProject("SVV");
        Group groupPersisted = groupRepository.save(group);

        assertThat(groupPersisted, notNullValue());
        assertThat(groupPersisted.getId(), notNullValue());
        assertThat(groupPersisted.getName(), comparesEqualTo(group.getName()));
        assertThat(groupPersisted.getUsers(), empty());
        assertThat(groupPersisted.getOwner(), is(equalTo(group.getOwner())));
    }

    @Test
    public void createGroup_withUser_fromOwnerSide() {
        User mab = createUser("mab");
        userRepository.save(mab);

        Group group = createProject("SVV");
        userRepository.save(group.getOwner());
        group.addUser(mab);
        Group groupPersisted = groupRepository.save(group);

        assertThat(groupPersisted.getId(), notNullValue());
        assertThat(groupPersisted.getUsers(), contains(mab));

        Optional<Group> currentGroup = groupRepository.findById(groupPersisted.getId());
        assertThat(currentGroup.get().getUsers(), contains(mab));
    }

    @Test
    public void createGroup_withUser_cascade_fromOwnerSide() {
        User mab = createUser("mab");
        Group group = createProject("SVV");

        group.addUser(mab);
        Group groupPersisted = groupRepository.save(group);

        assertThat(groupPersisted.getId(), notNullValue());
        assertThat(groupPersisted.getUsers(), contains(mab));
        assertThat(groupPersisted.getOwner(), is(equalTo(group.getOwner())));

        Optional<Group> currentGroup = groupRepository.findById(groupPersisted.getId());
        assertThat(currentGroup.get().getUsers(), contains(mab));
        assertThat(currentGroup.get().getOwner(), is(equalTo(group.getOwner())));
    }

    @Test
    public void createGroup_withPolicies() {
        PolicyMinAvailableUser policy = new PolicyMinAvailableUser();
        policy.setMinUsers(2);
        policy.setName("Min 2 Users");
        policyRepository.save(policy);

        User mab = createUser("mab");
        User foo = createUser("foo");
        userRepository.save(mab);
        userRepository.save(foo);

        PolicyMinAvailableUserOfDefinedGroup policy2 = new PolicyMinAvailableUserOfDefinedGroup();
        policy2.setMinAvailableUsers(1);
        policy2.setUserGroup(Set.of(mab, foo));
        policy2.setName("Min 2 out of defined group");
        policyRepository.save(policy2);

        Group group = createProject("SVV");
        group.addPolicy(policy);
        group.addPolicy(policy2);
        Group groupPersisted = groupRepository.save(group);

        Optional<Group> currentGroup = groupRepository.findById(groupPersisted.getId());
        assertThat(currentGroup.get().getPolicies(), not(empty()));
        assertThat(currentGroup.get().getPolicies().contains(policy), is(true));
        assertThat(currentGroup.get().getPolicies().contains(policy2), is(true));
    }

    @Disabled
    @Test
    public void removePolicy() {
        PolicyMinAvailableUser policy = new PolicyMinAvailableUser();
        policy.setMinUsers(2);
        policy.setName("Min 2 Users");

        Group group = createProject("SVV");
        group.addPolicy(policy);
        Group groupPersisted = groupRepository.save(group);

        Optional<Group> currentGroup = groupRepository.findById(groupPersisted.getId());
        assertThat(currentGroup.get().getPolicies(), contains(policy));

        currentGroup.get().getPolicies().remove(policy);
        groupRepository.save(currentGroup.get());

        // policyRepository.delete(policy);
        Optional<Policy> currentPolicy = policyRepository.findById(currentGroup.get().getPolicies().iterator().next().getId());
        assertThat(currentPolicy.isEmpty(), is(true));

        currentGroup = groupRepository.findById(groupPersisted.getId());
        assertThat(currentGroup.get().getPolicies(), empty());
    }
}
