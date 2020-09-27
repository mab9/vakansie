package ch.mab.vakansie.groups;

import ch.mab.vakansie.users.User;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

public interface GroupService {

    Group createTeam(String groupName);

    Group addUserToGroup(UUID groupId, User user);

    Group removeUserFromGroup(UUID groupId, UUID userId);

    Optional<Group> findById(UUID id);

    Group createProject(String projectName);

    GroupSpace createSpace(Group group, User owner);

    Set<Group> findAllGroupsByTeam(UUID teamId);
}
