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
  Popover,
  InputAdornment,
  FormControlLabel,
} from "@mui/material";
import { Search, KeyboardArrowDown, FilterList, TableRows, FileDownload } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [selected, setSelected] = useState<string[]>([]);
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [searchTerm, setSearchTerm] = useState<string>("");


  // Menu states
  const [manageColumnsAnchor, setManageColumnsAnchor] = useState<HTMLButtonElement | null>(null);
  const [filterAnchor, setFilterAnchor] = useState<HTMLButtonElement | null>(null);
  const [searchTermsColumnWise, setSearchTermsColumnWise] = useState({ jobId: "", customerName: "", carModel: "" });


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

  function handleSearchColumnWise(id: string, e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
    throw new Error("Function not implemented.");
  }

  return (
    <>
      <div>
        <button onClick={() => navigate("/create-form")} style={{ color: "white",backgroundColor:"green", right:"20px"}}>Add Form</button>
      </div>
      <Box sx={{ width: "100%", p: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mb: 2,
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="h6" component="h1" sx={{ fontWeight: 500 }}>
              Job Card Reports
            </Typography>
            <TextField
              size="small"
              placeholder="Search"
              sx={{
                bgcolor: "grey.50",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "grey.300",
                  },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search fontSize="small" />
                  </InputAdornment>
                ),
              }}
              onChange={handleSearch}
            />
          </Box>

          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="outlined"
              size="small"
              endIcon={<KeyboardArrowDown />}
              startIcon={<TableRows />}
              sx={{
                bgcolor: "grey.50",
                textTransform: "none",
                color: "text.primary",
              }}
              onClick={(e) => setManageColumnsAnchor(e.currentTarget)}
            >
              Manage Columns
            </Button>

            <Menu
              anchorEl={manageColumnsAnchor}
              open={Boolean(manageColumnsAnchor)}
              onClose={() => setManageColumnsAnchor(null)}
              PaperProps={{
                sx: { maxHeight: 300, width: 200 },
              }}
            >
              {columns.map((column) => (
                <MenuItem key={column.id} dense>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={column.visible}
                        onChange={() => handleColumnVisibilityChange(column.id)}
                        size="small"
                      />
                    }
                    label={column.label}
                  />
                </MenuItem>
              ))}
            </Menu>

            <Button
              variant="outlined"
              size="small"
              endIcon={<KeyboardArrowDown />}
              sx={{
                bgcolor: "grey.50",
                textTransform: "none",
                color: "text.primary",
              }}
            >
              Default View
            </Button>

            <Button
              variant="outlined"
              size="small"
              endIcon={<KeyboardArrowDown />}
              startIcon={<FilterList />}
              sx={{
                bgcolor: "grey.50",
                textTransform: "none",
                color: "text.primary",
              }}
              onClick={(e) => setFilterAnchor(e.currentTarget)}
            >
              Filter
            </Button>

            <Popover
              open={Boolean(filterAnchor)}
              anchorEl={filterAnchor}
              onClose={() => setFilterAnchor(null)}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              PaperProps={{
                sx: { p: 2, width: 650 },
              }}
            >
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                filter Columns-wise
              </Typography>
              {columns.map((column) => (
                <MenuItem key={column.id} dense>
                  <TextField
                    placeholder={`Search ${column.label}`}
                    variant="outlined"
                    size="small"
                    value={searchTermsColumnWise[column.id as keyof typeof searchTermsColumnWise]}
                    onChange={(e) => handleSearchColumnWise(column.id, e)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                    fullWidth
                  />
                </MenuItem>
              ))}
            </Popover>

            <Button
              variant="outlined"
              size="small"
              endIcon={<KeyboardArrowDown />}
              startIcon={<FileDownload />}
              sx={{
                bgcolor: "grey.50",
                textTransform: "none",
                color: "text.primary",
              }}
            >
              Export
            </Button>
          </Box>
        </Box>

        <TableContainer
          component={Paper}
          sx={{ maxHeight: "calc(100vh - 180px)" }}
        >
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox" sx={{ bgcolor: "grey.50" }}>
                  <Checkbox
                    indeterminate={
                      selected.length > 0 && selected.length < filteredData.length
                    }
                    checked={
                      filteredData.length > 0 && selected.length === filteredData.length
                    }
                    onChange={handleSelectAllClick}
                  />
                </TableCell>
                {columns
                  .filter((col) => col.visible)
                  .map((column) => (
                    <TableCell
                      key={column.id}
                      sx={{
                        bgcolor: "grey.50",
                        fontWeight: 500,
                        color: "text.secondary",
                      }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.jobId);

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.jobId)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.jobId}
                      selected={isItemSelected}
                      sx={{
                        bgcolor: index % 2 === 0 ? "white" : "grey.50",
                        "&:hover": {
                          bgcolor: "action.hover",
                        },
                      }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox checked={isItemSelected} />
                      </TableCell>
                      {columns
                        .filter((col) => col.visible)
                        .map((column) => (
                          <TableCell key={column.id}>{row[column.id]}</TableCell>
                        ))}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
    </>
  );
};

export default JobCardTable;
