"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { firestore } from "@/firebase";
import {
  Box,
  Typography,
  Modal,
  Stack,
  TextField,
  Button,
  CircularProgress,
  Tooltip,
  Snackbar,
  Alert,
  IconButton,
  Input,
} from "@mui/material";
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Image as ImageIcon,
} from "@mui/icons-material";
import {
  collection,
  query,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      main: "#6200ea", // Purple color
    },
    secondary: {
      main: "#3700b3", // Dark purple color
    },
    background: {
      default: "#121212", // Dark background color
      paper: "#1e1e1e", // Dark paper color for modals and cards
    },
    text: {
      primary: "#ffffff", // White text color for contrast
      secondary: "#b0b0b0", // Light gray text color
    },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
    h2: {
      fontSize: "2rem",
      fontWeight: 600,
    },
    h3: {
      fontSize: "1.5rem",
      fontWeight: 500,
    },
    button: {
      textTransform: "none",
    },
  },
});

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [itemImages, setItemImages] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const updateInventory = async () => {
    setLoading(true);
    const snapshot = query(collection(firestore, "inventory"));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
    setLoading(false);
  };

  const filteredInventory = inventory.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }

    await updateInventory();
    setSnackbarMessage("Item added successfully!");
    setSnackbarOpen(true);
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }

    await updateInventory();
    setSnackbarMessage("Item removed successfully!");
    setSnackbarOpen(true);
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleImageUpload = (event, itemName) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setItemImages((prevImages) => ({
          ...prevImages,
          [itemName]: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const backgroundImage = "https://example.com/path-to-your-image.jpg"; // Replace with your image URL

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        width="100vw"
        height="100vh"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        gap={2}
        sx={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Modal open={open} onClose={handleClose}>
          <Box
            position="absolute"
            top="50%"
            left="50%"
            width={400}
            bgcolor="background.paper"
            border="2px solid #0000"
            boxShadow={24}
            p={4}
            display="flex"
            flexDirection="column"
            gap={3}
            sx={{ transform: "translate(-50%,-50%)", borderRadius: "8px" }}
          >
            <Typography variant="h6" color="text.primary">
              Add Item
            </Typography>
            <Stack width="100%" direction="row" spacing={2}>
              <TextField
                variant="outlined"
                fullWidth
                value={itemName}
                onChange={(e) => {
                  setItemName(e.target.value);
                }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  addItem(itemName);
                  setItemName("");
                  handleClose();
                }}
                startIcon={<AddIcon />}
              >
                Add
              </Button>
            </Stack>
          </Box>
        </Modal>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            handleOpen();
          }}
          startIcon={<AddIcon />}
        >
          Add New Item
        </Button>
        <TextField
          variant="outlined"
          fullWidth
          placeholder="Search items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
            maxWidth: "800px",
            bgcolor: "background.paper",
            borderRadius: "8px",
          }}
        />
        {loading ? (
          <CircularProgress color="primary" />
        ) : (
          <Box
            border="1px solid #333"
            sx={{
              maxWidth: "800px",
              borderRadius: "8px",
              overflow: "hidden",
              bgcolor: "background.paper",
            }}
          >
            <Box
              width="800px"
              height="100px"
              bgcolor="primary.main"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Typography variant="h2" color="text.primary">
                Inventory Items
              </Typography>
            </Box>
            <Stack
              width="100%"
              spacing={2}
              overflow="auto"
              sx={{ padding: "16px" }}
            >
              {filteredInventory.map(({ name, quantity }) => (
                <Box
                  key={name}
                  width="100%"
                  minHeight="150px"
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  bgcolor="background.paper"
                  padding={5}
                  sx={{
                    borderRadius: "8px",
                    boxShadow: 1,
                    transition: "transform 0.3s",
                    "&:hover": { transform: "scale(1.02)" },
                  }}
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    <label htmlFor={`upload-button-${name}`}>
                      <Input
                        id={`upload-button-${name}`}
                        type="file"
                        style={{ display: "none" }}
                        onChange={(e) => handleImageUpload(e, name)}
                      />
                      <IconButton component="span">
                        {itemImages[name] ? (
                          <img
                            src={itemImages[name]}
                            alt={name}
                            style={{
                              width: 40,
                              height: 40,
                              borderRadius: "50%",
                            }}
                          />
                        ) : (
                          <ImageIcon color="primary" sx={{ fontSize: 40 }} />
                        )}
                      </IconButton>
                    </label>
                    <Typography
                      variant="h3"
                      color="text.primary"
                      textAlign="center"
                    >
                      {name.charAt(0).toUpperCase() + name.slice(1)}
                    </Typography>
                  </Stack>
                  <Typography
                    variant="h3"
                    color="text.primary"
                    textAlign="center"
                  >
                    {quantity}
                  </Typography>
                  <Stack direction="row" spacing={2}>
                    <Tooltip title="Add item">
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          addItem(name);
                        }}
                        startIcon={<AddIcon />}
                      >
                        Add
                      </Button>
                    </Tooltip>
                    <Tooltip title="Remove item">
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => {
                          removeItem(name);
                        }}
                        startIcon={<RemoveIcon />}
                      >
                        Remove
                      </Button>
                    </Tooltip>
                  </Stack>
                </Box>
              ))}
            </Stack>
          </Box>
        )}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity="success"
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}
