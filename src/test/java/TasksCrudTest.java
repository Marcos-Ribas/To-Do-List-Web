import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.*;

import static io.restassured.RestAssured.*;
import static org.hamcrest.Matchers.*;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class TasksCrudTest {

  private static String baseUrl = "http://localhost:3000";
  private static String createdTaskId;

  @BeforeAll
  public static void setup() {
    // Configura a URL base para todas as requisições
    RestAssured.baseURI = baseUrl;
  }

  @Test
  @Order(1)
  public void testCreateTask() {
    String payload = """
          {
            "title": "Teste Java",
            "description": "Criada via REST-assured",
            "completed": false
          }
        """;

    createdTaskId = given()
        .contentType(ContentType.JSON)
        .body(payload)
        .when()
        .post("/tasks")
        .then()
        .statusCode(201)
        .body("title", equalTo("Teste Java"))
        .body("completed", equalTo(false))
        .extract()
        .path("_id");
  }

  @Test
  @Order(2)
  public void testGetAllTasks() {
    when()
        .get("/tasks")
        .then()
        .statusCode(200)
        .body("$", not(empty())); // garante que o array não esteja vazio
  }

  @Test
  @Order(3)
  public void testGetSingleTask() {
    when()
        .get("/tasks/{id}", createdTaskId)
        .then()
        .statusCode(200)
        .body("_id", equalTo(createdTaskId))
        .body("title", equalTo("Teste Java"));
  }

  @Test
  @Order(4)
  public void testUpdateTask() {
    String updatePayload = """
          {
            "completed": true
          }
        """;

    given()
        .contentType(ContentType.JSON)
        .body(updatePayload)
        .when()
        .put("/tasks/{id}", createdTaskId)
        .then()
        .statusCode(200)
        .body("completed", equalTo(true));
  }

  @Test
  @Order(5)
  public void testDeleteTask() {
    when()
        .delete("/tasks/{id}", createdTaskId)
        .then()
        .statusCode(204);

    // Confirma que o recurso sumiu
    when()
        .get("/tasks/{id}", createdTaskId)
        .then()
        .statusCode(404);
  }
}
