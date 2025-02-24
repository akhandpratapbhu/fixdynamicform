import { useState, ChangeEvent, MouseEvent } from "react";
import {
  Box,
  Paper,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
  Checkbox,
  Menu,
  MenuItem,
} from "@mui/material";
import { Search, KeyboardArrowDown, FilterList } from "@mui/icons-material";

interface JobData {
  jobId: string;
  date: string;
  customerName: string;
  carModel: string;
  chassisNo: string;
  serviceType: string;
  technicianName: string;
  defaultView: string;
  serviceDescription: string;
}

interface Column {
  id: keyof JobData;
  label: string;
  visible: boolean;
}

const mockData: JobData[] = [
  {
    jobId: "J00012345",
    date: "13-02-2025",
    customerName: "Jatin Bansal",
    carModel: "Sartaj 5252 Diesel",
    chassisNo: "LZZ5EXSA2D51",
    serviceType: "Full Service",
    technicianName: "Hunar Jagwani",
    defaultView: "Full Entry/Brake Fee",
    serviceDescription: "Oil Change, Brake Inspection & Replace",
  },
  {
    jobId: "J00012346",
    date: "12-02-2025",
    customerName: "Anurag Tiwari",
    carModel: "Samrat GS Tipper",
    chassisNo: "LZZ5EXSA2D51",
    serviceType: "Oil Change",
    technicianName: "Mahesh Kumar",
    defaultView: "Transmission Fluid",
    serviceDescription: "Oil Change, Fluid top-up",
  },
  {
    jobId: "J00012347",
    date: "11-02-2025",
    customerName: "Rohit Kumar",
    carModel: "Supreme GS",
    chassisNo: "LZZ5EXSA2D51",
    serviceType: "Transmission Repair",
    technicianName: "Tarun Tiwari",
    defaultView: "Brake Pads, Rotor",
    serviceDescription: "Rotation and balancing of tires",
  },
];

const initialColumns: Column[] = [
  { id: "jobId", label: "Job ID", visible: true },
  { id: "date", label: "Date", visible: true },
  { id: "customerName", label: "Customer Name", visible: true },
  { id: "carModel", label: "Car Model", visible: true },
  { id: "chassisNo", label: "Chassis No", visible: true },
  { id: "serviceType", label: "Service Type", visible: true },
  { id: "technicianName", label: "Technician Name", visible: true },
  { id: "defaultView", label: "Default View", visible: true },
  { id: "serviceDescription", label: "Service Description", visible: true },
];

const JobCardTable: React.FC = () => {
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [selected, setSelected] = useState<string[]>([]);
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleSelectAllClick = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = mockData.map((n) => n.jobId);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const filteredData = mockData.filter((item) =>
    Object.values(item).some((value) =>
      String(value).toLowerCase().includes(searchTerm)
    )
  );

  const handleClick = (event: MouseEvent<HTMLTableRowElement>, id: string) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = [...selected, id];
    } else {
      newSelected = selected.filter((selectedId) => selectedId !== id);
    }

    setSelected(newSelected);
  };

  const handleColumnVisibilityChange = (columnId: keyof JobData) => {
    setColumns(
      columns.map((col) =>
        col.id === columnId ? { ...col, visible: !col.visible } : col
      )
    );
  };

  const isSelected = (id: string) => selected.includes(id);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ width: "100%", p: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h6">Job Card Reports</Typography>
        <TextField
          size="small"
          placeholder="Search"
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <Search sx={{ mr: 1, color: "gray" }} />
            ),
          }}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  onChange={handleSelectAllClick}
                  checked={selected.length === mockData.length}
                />
              </TableCell>
              {columns.map(
                (column) =>
                  column.visible && (
                    <TableCell key={column.id}>{column.label}</TableCell>
                  )
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                const isItemSelected = isSelected(row.jobId);
                return (
                  <TableRow
                    key={row.jobId}
                    onClick={(event) => handleClick(event, row.jobId)}
                    selected={isItemSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox checked={isItemSelected} />
                    </TableCell>
                    {columns.map(
                      (column) =>
                        column.visible && (
                          <TableCell key={column.id}>
                            {row[column.id]}
                          </TableCell>
                        )
                    )}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
};

export default JobCardTable;
