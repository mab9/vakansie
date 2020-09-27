package ch.mab.vakansie.groups;

import ch.mab.vakansie.users.User;
import ch.mab.vakansie.users.UserRepository;
import java.util.Collection;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import org.hibernate.service.spi.ServiceException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Service
public class GroupServiceImpl implements GroupService {

    @Autowired
    private GroupRepository groupRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional(readOnly = true, propagation = Propagation.SUPPORTS)
    public Collection<Group> findAll() {
        return groupRepository.findAll();
    }

    @Override
    public Group createTeam(String groupName) {
        GroupTeam team = new GroupTeam();
        team.setName(groupName);
        return groupRepository.save(team);
    }

    @Override
    public GroupSpace createSpace(Group group, User owner) {
        Objects.requireNonNull(group);
        Objects.requireNonNull(owner);

        group.setOwner(owner);
        return (GroupSpace) groupRepository.save(group);
    }

    @Override
    public Group addUserToGroup(UUID groupId, User user) {
        Optional<Group> group = groupRepository.findById(groupId);
        // todo throw exception if not found
        group.get().addUser(user);
        return group.get();
    }

    @Override
    public Group removeUserFromGroup(UUID groupId, UUID userId) {
        Optional<Group> group = groupRepository.findById(groupId);
        Optional<User> user = userRepository.findById(userId);
        group.get().getUsers().remove(user.get());
        return group.get();
    }

    @Transactional(readOnly = true, propagation = Propagation.SUPPORTS)
    public Optional<Group> findById(UUID id) {
        return groupRepository.findById(id);
    }

    @Override
    public Group createProject(String projectName) {
        GroupProject project = new GroupProject();
        project.setName(projectName);
        return groupRepository.save(project);
    }

    @Override
    @Transactional(readOnly = true, propagation = Propagation.SUPPORTS)
    public Set<Group> findAllGroupsByTeam(UUID teamId) {
        return null;
    }
}
