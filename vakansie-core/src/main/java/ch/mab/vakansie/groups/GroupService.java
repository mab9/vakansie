package ch.mab.vakansie.groups;

import ch.mab.vakansie.users.User;
import java.time.LocalDate;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import org.springframework.data.util.Pair;

public interface GroupService {

    Group createTeam(String groupName);

    Group addUserToGroup(UUID groupId, User user);

    Group removeUserFromGroup(UUID groupId, UUID userId);

    Optional<Group> findById(UUID id);

    Group createProject(String projectName);

    Set<Group> findAllGroupsByTeam(UUID teamId);

    Set<Policy> findAllRulesByGroupId(UUID groupId);

    Set<Pair<Policy, Set<LocalDate>>> checkRulesForGroupId(UUID groupId);

    Policy createRule(Policy rule);

    Policy removeRule(UUID ruleId);

    Policy updateRule(UUID ruleId);
}
