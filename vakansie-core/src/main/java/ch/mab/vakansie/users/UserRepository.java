package ch.mab.vakansie.users;

import ch.mab.vakansie.groups.Group;
import java.util.Collection;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

    User findByIdAndVersion(UUID id, long version);

    List<User> findUserByGroupsIn(Collection<Group> groups);

}
