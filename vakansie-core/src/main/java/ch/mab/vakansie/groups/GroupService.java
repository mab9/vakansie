package ch.mab.vakansie.groups;

import java.util.Collection;
import java.util.Optional;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class GroupService {

    @Autowired
    private GroupRepository groupRepository;

    public Collection<Group> findAll() {
        return groupRepository.findAll();
    }

    public Optional<Group> findById(UUID id){
        return groupRepository.findById(id);
    }

    public Group createGroup(Group group) {
        return groupRepository.save(group);
    }
}
