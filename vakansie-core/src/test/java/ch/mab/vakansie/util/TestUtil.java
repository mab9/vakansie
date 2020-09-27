package ch.mab.vakansie.util;

import ch.mab.vakansie.groups.Group;
import ch.mab.vakansie.groups.GroupProject;
import ch.mab.vakansie.groups.GroupRepository;
import ch.mab.vakansie.groups.GroupSpace;
import ch.mab.vakansie.groups.GroupTeam;
import ch.mab.vakansie.policies.Policy;
import ch.mab.vakansie.policies.PolicyMinAvailableUser;
import ch.mab.vakansie.policies.PolicyRepository;
import ch.mab.vakansie.users.User;
import ch.mab.vakansie.users.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

@Transactional
public abstract class TestUtil {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private GroupRepository groupRepository;

    @Autowired
    private PolicyRepository policyRepository;

    protected User createUser(String name) {
        User user = new User();
        user.setName(name);
        user.setEmail(name + "@vakansie.com");
        return user;
    }

    protected User createUserAndPersist(String name) {
        User user = createUser(name);
        return userRepository.save(user);
    }

    private Group createGroup(Group group, String name) {
        User owner = createUser("owner");
        group.setName(name);
        group.setOwner(owner);
        return group;
    }

    protected Policy createMinAvailabeUserPolicy(String name, int minNoOfUser) {
        PolicyMinAvailableUser policy = new PolicyMinAvailableUser();
        policy.setName(name);
        policy.setMinUsers(minNoOfUser);
        return policyRepository.save(policy);
    }

    protected GroupSpace createSpace(String name) {
        Group group = createGroup(new GroupSpace(), name);
        return (GroupSpace) group;
    }

    protected GroupSpace createSpaceAndPersist(String name) {
        return groupRepository.save(createSpace(name));
    }


    protected GroupTeam createTeam(String name) {
        Group group = createGroup(new GroupTeam(), name);
        return (GroupTeam) group;
    }

    protected GroupTeam createTeamAndPersist(String name) {
        return groupRepository.save(createTeam(name));
    }

    protected GroupProject createProject(String name) {
        Group group = createGroup(new GroupProject(), name);
        return (GroupProject) group;
    }

    protected GroupProject createProjectAndPersist(String name) {
        return groupRepository.save(createProject(name));
    }
}
