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
  TableSortLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  DialogActions,
} from "@mui/material";
import { Search, KeyboardArrowDown, FilterList, TableRows, FileDownload } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx"; // Excel library
import jsPDF from "jspdf"; // PDF library
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
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState<string>("");

  // Menu states
  const [manageColumnsAnchor, setManageColumnsAnchor] = useState<HTMLButtonElement | null>(null);
  const [filterAnchor, setFilterAnchor] = useState<HTMLButtonElement | null>(null);
  const [searchTermsColumnWise, setSearchTermsColumnWise] = useState<Record<keyof JobData, string>>({
    jobId: "",
    date: "",
    customerName: "",
    carModel: "",
    chassisNo: "",
    serviceType: "",
    technicianName: "",
    defaultView: "",
    serviceDescription: "",
  });


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

  // const filteredData = mockData.filter((item) =>
  //   Object.values(item).some((value) =>
  //     String(value).toLowerCase().includes(searchTerm)
  //   )
  // );

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

  const handleSearchColumnWise = (id: keyof JobData, e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSearchTermsColumnWise((prev) => ({
      ...prev,
      [id]: e.target.value.toLowerCase(),
    }));
  };


  const filteredData = mockData.filter((item) => {
    // Global Search Logic
    const isGlobalMatch = Object.values(item).some((value) =>
      String(value).toLowerCase().includes(searchTerm)
    );

    // Column-Wise Search Logic
    const isColumnMatch = Object.entries(searchTermsColumnWise).every(([key, term]) => {
      if (!term) return true; // Skip filtering for empty search fields
      return String(item[key as keyof JobData]).toLowerCase().includes(term);
    });

    return isGlobalMatch && isColumnMatch; // Both filters should match
  });

  const handleRequestSort = (columnId: string) => {
    const isAsc = orderBy === columnId && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(columnId);
  };

  const sortedData = [...filteredData].sort((a, b) => {
    if (orderBy) {
      const key = orderBy as keyof JobData; // ✅ Explicitly tell TypeScript it's a valid key

      if (a[key] < b[key]) return order === "asc" ? -1 : 1;
      if (a[key] > b[key]) return order === "asc" ? 1 : -1;
    }
    return 0;
  });
  const [open, setOpen] = useState(false);

  // Function to export data as Excel
  const exportAsExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData); // Convert JSON to worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    XLSX.writeFile(workbook, "export.xlsx");
    setOpen(false); // Close dialog
  };

  // Function to export data as PDF
  const exportAsPDF = () => {
    const doc = new jsPDF();
    doc.text("Exported Data", 10, 10);

    let y = 20;
    filteredData.forEach((item, index) => {
      doc.text(`${index + 1}. ${JSON.stringify(item)}`, 10, y);
      y += 10;
    });

    doc.save("export.pdf");
    setOpen(false); // Close dialog
  };
  return (
    <>
      <div>
        <button onClick={() => navigate("/create-form")} style={{ color: "white", backgroundColor: "green", right: "20px" }}>Add Form</button>
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
                    value={searchTermsColumnWise[column.id]} // Bind input value
                    onChange={(e) => handleSearchColumnWise(column.id, e)} // Handle change
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

            {/* Export Button */}
            <Button
              variant="outlined"
              size="small"
              endIcon={<KeyboardArrowDown />}
              startIcon={<FileDownload />}
              sx={{ bgcolor: "grey.50", textTransform: "none", color: "text.primary" }}
              onClick={() => setOpen(true)}
            >
              Export
            </Button>

            {/* Dialog Popup */}
            <Dialog open={open} onClose={() => setOpen(false)}>
              <DialogTitle>Select Export Format</DialogTitle>
              <DialogContent>
                <List>
                  <ListItem disablePadding>
                    <ListItemButton onClick={exportAsPDF}>
                      <ListItemText primary="Export as PDF" />
                    </ListItemButton>
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemButton onClick={exportAsExcel}>
                      <ListItemText primary="Export as Excel" />
                    </ListItemButton>
                  </ListItem>
                </List>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpen(false)} color="primary">Cancel</Button>
              </DialogActions>
            </Dialog>
          </Box>
        </Box>

        <TableContainer component={Paper} sx={{ maxHeight: "calc(100vh - 180px)" }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox" sx={{ bgcolor: "grey.50" }}>
                  <Checkbox
                    indeterminate={selected.length > 0 && selected.length < sortedData.length}
                    checked={sortedData.length > 0 && selected.length === sortedData.length}
                    onChange={handleSelectAllClick}
                  />
                </TableCell>
                {columns.filter((col) => col.visible).map((column) => (
                  <TableCell
                    key={column.id}
                    sx={{ bgcolor: "grey.50", fontWeight: 500, color: "text.secondary" }}
                    sortDirection={orderBy === column.id ? order : false}
                  >
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={orderBy === column.id ? order : "asc"}
                      onClick={() => handleRequestSort(column.id)}
                    >
                      {column.label}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
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
                      "&:hover": { bgcolor: "action.hover" },
                    }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox checked={isItemSelected} />
                    </TableCell>
                    {columns.filter((col) => col.visible).map((column) => (
                      <TableCell key={column.id}>{row[column.id]}</TableCell>
                    ))}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>;

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
