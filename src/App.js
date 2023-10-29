import { useState } from "react";
import "./App.css";

function App() {
  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    leaveDays: 0,
  });
  const [modalData, setModalData] = useState({ show: false, data: null });

  async function applyForLeave(data) {
    try {
      const response = await fetch("http://localhost:5000/applyLeave", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log(result);
      if (result.error) {
        if (result.error.name === "requestError") {
          // Handle your custom error here
          console.log("Custom error:", result.error.message);
        } else {
          // Handle other errors or throw them if needed
          throw result.error;
        }
      } else {
        if (result.leaveDays > 0) {
          setModalData({
            show: true,
            data: `Remaining leave ${result.leaveDays} days`,
          });
        } else {
          setModalData({
            show: true,
            data: `Remaining leave ${result.leaveDays} days , So no more leaves for you`,
          });
        }
      }

      return result;
    } catch (error) {
      // Handle network errors or other exceptions here
      console.error("Error:", error);
      throw error; // Rethrow the error if necessary
    }
  }

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <div
          style={{
            marginBottom: "20px",
            fontSize: "20px",
            textAlign: "center",
          }}
        >
          ATTENDANCE MANAGEMENT SYSTEM
        </div>
        {modalData.show ? (
          <div>
            <div>{modalData.data}</div>
            <button
              style={{ marginTop: "24px" }}
              onClick={() => {
                window.location.reload();
              }}
            >
              GO BACK TO SUBMIT
            </button>
          </div>
        ) : (
          <form
            style={{
              maxWidth: "200px",
            }}
            onChange={(e) => {
              console.log(e.target.value);
              setFormData({
                ...formData,
                [e.target.name]: e.target.value,
              });
            }}
            onSubmit={(e) => {
              e.preventDefault();
              applyForLeave(formData);
            }}
          >
            <div
              style={{
                paddingTop: "16px",
                paddingBottom: "16px",
              }}
            >
              <InputBox text="Name" name="name" type="text" required />
            </div>
            <div
              style={{
                paddingTop: "16px",
                paddingBottom: "16px",
              }}
            >
              <InputBox
                text="Designation"
                name="designation"
                category="select"
                option={[" ", "ADMIN", "MANAGER", "EMPLOYEE"]}
                required
              />
            </div>

            <div
              style={{
                paddingTop: "16px",
                paddingBottom: "16px",
              }}
            >
              <InputBox
                text="Leave Days"
                name="leaveDays"
                category="select"
                option={[0, 1, 2, 3, 4, 5]}
                required
              />
            </div>
            <button style={{ width: "100%", marginTop: "16px" }} type="submit">
              SUBMIT
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default App;

const InputBox = (props) => {
  return (
    <div style={{ width: "100%" }}>
      {!props.category && (
        <div style={{ width: "100%" }}>
          <div>{props.text}</div>
          <input
            style={{
              marginTop: "8px",
            }}
            className="override"
            name={props.name}
            type={props.type}
            required={props.required}
          />
        </div>
      )}

      {props.category === "select" && (
        <>
          <div>{props.text}</div>
          <select style={{ marginTop: "8px", width: "100%" }} name={props.name}>
            {props.option?.map(
              (data, index) =>
                data && (
                  <option
                    key={index}
                    style={{
                      textTransform: "capitalize",
                    }}
                    value={data}
                  >
                    {data}
                  </option>
                )
            )}
          </select>
        </>
      )}
    </div>
  );
};
