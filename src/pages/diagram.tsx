import { useState, useEffect } from "react";
import { OrganizationChart } from "primereact/organizationchart";

type Employee = {
  id: number;
  firstName: string;
  lastName: string;
  position: string;
  manager_id: number | null;
};

type HierarchyNode = {
  label: string;
  data: string;
  expanded?: boolean;
  children?: HierarchyNode[];
};

type EmployeeResponse = {
  current_page: number;
  data: Employee[];
  next_page_url: string | null;
};

const EmployeeHierarchy = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [scale, setScale] = useState<number>(1); // State for scaling

  useEffect(() => {
    const fetchEmployees = async () => {
      let allEmployees: Employee[] = [];
      let nextPageUrl: string | null = "http://localhost:8001/api/employees";

      while (nextPageUrl) {
        try {
          const response = await fetch(nextPageUrl);
          const data: EmployeeResponse = await response.json();
          allEmployees = [...allEmployees, ...data.data];
          nextPageUrl = data.next_page_url;
        } catch (err) {
          setError("Error fetching employee data");
          break;
        }
      }

      setEmployees(allEmployees);
      setLoading(false);
    };

    fetchEmployees();
  }, []);

  const buildHierarchy = (employees: Employee[]): HierarchyNode[] => {
    const employeeMap: { [key: number]: HierarchyNode } = {};
    const rootNodes: HierarchyNode[] = [];

    employees.forEach((emp) => {
      employeeMap[emp.id] = {
        label: `${emp.firstName} ${emp.lastName}`,
        data: emp.position,
        expanded: true,
        children: [],
      };
    });

    employees.forEach((emp) => {
      if (emp.manager_id === null) {
        rootNodes.push(employeeMap[emp.id]);
      } else if (employeeMap[emp.manager_id]) {
        employeeMap[emp.manager_id].children!.push(employeeMap[emp.id]);
      }
    });

    return rootNodes;
  };

  const nodeTemplate = (node: HierarchyNode) => (
    <div className="org-chart-node">
      <div className="name">{node.label}</div>
      <div className="position">{node.data}</div>
    </div>
  );

  const handleZoomIn = () => {
    setScale((prevScale) => Math.min(prevScale + 0.1, 2));
  };

  const handleZoomOut = () => {
    setScale((prevScale) => Math.max(prevScale - 0.1, 0.5));
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="container">
      <div className="controls">
        <button onClick={handleZoomIn} className="zoom-button">
          +
        </button>
        <button onClick={handleZoomOut} className="zoom-button">
          -
        </button>
      </div>
      <div className="card overflow-x-auto">
        <div
          className="org-chart-wrapper"
          style={{ transform: `scale(${scale})`, transformOrigin: "top left" }}
        >
          <OrganizationChart
            value={buildHierarchy(employees)}
            nodeTemplate={nodeTemplate}
            className="org-chart"
          />
        </div>
      </div>
    </div>
  );
};

export default EmployeeHierarchy;
