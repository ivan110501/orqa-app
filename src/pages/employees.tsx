import React, { useEffect, useState } from "react";

type Employee = {
  id: number;
  firstName: string;
  lastName: string;
  position: string;
  imageUrl: string;
  email: string;
  about: string;
  contactNumber: string;
  adress: string;
};

type EmployeeResponse = {
  data: Employee[];
  next_page_url: string | null;
};

const Employees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [nextPageUrl, setNextPageUrl] = useState<string | null>(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchedEmployee, setSearchedEmployee] = useState<Employee | null>(
    null
  );
  const [searchError, setSearchError] = useState<string>("");

  useEffect(() => {
    fetchEmployees(currentPage);
  }, [currentPage]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight
      ) {
        if (nextPageUrl) {
          setCurrentPage((prev) => prev + 1);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [nextPageUrl]);

  const fetchEmployees = async (page: number) => {
    try {
      const response = await fetch(
        `http://localhost:8001/api/employees?page=${page}`
      );
      const data: EmployeeResponse = await response.json();
      setEmployees((prev) => [...prev, ...data.data]);
      setNextPageUrl(data.next_page_url);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const searchEmployees = async (query: string) => {
    try {
      const searchParam = encodeURIComponent(query);
      const response = await fetch(
        `http://localhost:8001/api/employees?search=${searchParam}`
      );
      const data: EmployeeResponse = await response.json();
      if (data.data.length > 0) {
        setSearchedEmployee(data.data[0]);
        setSearchError("");
      } else {
        setSearchedEmployee(null);
        setSearchError("Employee with this name does not exist");
      }
    } catch (error) {
      console.error("Error searching employees:", error);
      setSearchError("Error searching employees");
    }
  };

  const resetSearch = () => {
    setSearchQuery("");
    setSearchedEmployee(null);
    setSearchError("");
    setEmployees([]);
    setCurrentPage(1);
    fetchEmployees(1);
  };

  const toggleDetails = (id: number) => {
    setSelectedEmployeeId((prev) => (prev === id ? null : id));
  };

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    searchEmployees(searchQuery);
  };

  return (
    <div className="content">
      <form className="input" onSubmit={handleSearch}>
        <input
          className="input"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name"
        />
        <div style={{ display: "flex" }}>
          {" "}
          <button className="button button--blue" type="submit">
            Search
          </button>
          {(searchedEmployee || searchError) && (
            <button
              type="button"
              className="button button--blue"
              onClick={resetSearch}
            >
              New search
            </button>
          )}
        </div>
      </form>
      <br />
      <div className="list">
        {searchError && <p>{searchError}</p>}
        {searchedEmployee && (
          <div className="searched-employee">
            <h2>Search result</h2>
            <table
              style={{
                textAlign: "center",
                borderSpacing: "4px",
                maxWidth: "min-content",
              }}
            >
              <thead>
                <tr>
                  <th>Picture</th>
                  <th>Name</th>
                  <th>Surname</th>
                  <th>Email</th>
                  <th>Positon</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                <React.Fragment key={searchedEmployee.id}>
                  <tr>
                    <td>
                      <img
                        className="employee employee--img"
                        src={searchedEmployee.imageUrl}
                        alt={searchedEmployee.firstName}
                        width="50"
                      />
                    </td>
                    <td>{searchedEmployee.firstName}</td>
                    <td>{searchedEmployee.lastName}</td>
                    <td>{searchedEmployee.email}</td>
                    <td>{searchedEmployee.position}</td>
                    <td>
                      {" "}
                      <button
                        className="button button--blue"
                        style={{ margin: "0.25rem" }}
                        onClick={() => toggleDetails(searchedEmployee.id)}
                      >
                        {selectedEmployeeId === searchedEmployee.id
                          ? "Hide"
                          : "Show"}
                      </button>
                    </td>
                  </tr>
                  {selectedEmployeeId === searchedEmployee.id && (
                    <tr>
                      <td colSpan={7}>
                        <div>
                          <p>
                            <strong>About:</strong> {searchedEmployee.about}
                          </p>
                          <p>
                            <strong>Contact:</strong>{" "}
                            {searchedEmployee.contactNumber}
                          </p>
                          <p>
                            <strong>Adress:</strong> {searchedEmployee.adress}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              </tbody>
            </table>
          </div>
        )}
        <table
          style={{
            textAlign: "center",
            borderSpacing: "4px",
            maxWidth: "min-content",
          }}
        >
          <thead>
            <tr>
              <th>#</th>
              <th>Picture</th>
              <th>Name</th>
              <th>Surname</th>
              <th>Email</th>
              <th>Position</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee, index) => (
              <React.Fragment key={employee.id}>
                <tr>
                  <td>{index + 1}</td>
                  <td>
                    <img
                      className="employee employee--img"
                      src={employee.imageUrl}
                      alt={employee.firstName}
                      width="50"
                    />
                  </td>
                  <td>{employee.firstName}</td>
                  <td>{employee.lastName}</td>
                  <td>{employee.email}</td>
                  <td>{employee.position}</td>
                  <td>
                    <button
                      className="button button--blue"
                      style={{ margin: "0.25rem" }}
                      onClick={() => toggleDetails(employee.id)}
                    >
                      {selectedEmployeeId === employee.id ? "Hide" : "Show"}
                    </button>
                  </td>
                </tr>
                {selectedEmployeeId === employee.id && (
                  <tr>
                    <td colSpan={7}>
                      <div>
                        <p>
                          <strong>About:</strong> {employee.about}
                        </p>
                        <p>
                          <strong>Contact:</strong> {employee.contactNumber}
                        </p>
                        <p>
                          <strong>Adress:</strong> {employee.adress}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Employees;
