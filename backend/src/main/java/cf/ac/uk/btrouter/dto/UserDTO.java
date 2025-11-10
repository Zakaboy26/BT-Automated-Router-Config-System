package cf.ac.uk.btrouter.dto;

public class UserDTO {
    private String firstName;
    private String email;

    public UserDTO(String firstName, String email) {
        this.firstName = firstName;
        this.email = email;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getEmail() {
        return email;
    }
}
