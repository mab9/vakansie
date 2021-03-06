package ch.mab.vakansie;

import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import ch.mab.vakansie.groups.GroupRepository;
import ch.mab.vakansie.users.User;
import ch.mab.vakansie.users.UserRepository;
import ch.mab.vakansie.util.TestUtil;
import com.google.gson.Gson;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

@SpringBootTest
@AutoConfigureMockMvc
public class UserControllerTest extends TestUtil {

    @Autowired
    private MockMvc mvc;

    @Test
    public void createUser() throws Exception {
        User mab = createUser("mab");

        String json = new Gson().toJson(mab);
        mvc.perform(MockMvcRequestBuilders.post("/users")
            .contentType(MediaType.APPLICATION_JSON)
            .content(json))
            .andDo(print())
            .andExpect(status().isOk());
    }

    @Test
    public void getUser() throws Exception {
        User mab = createUserAndPersist("mab");

        mvc.perform(MockMvcRequestBuilders.get("/users")
            .accept(MediaType.APPLICATION_JSON))
            .andDo(print())
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$[0].id").exists())
            .andExpect(jsonPath("$[0].name").value(mab.getName()))
            .andExpect(jsonPath("$[0].email").value(mab.getEmail()));
    }
}
