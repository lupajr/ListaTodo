import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Checkbox,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/todos';

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingTodo, setEditingTodo] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  // Carregar todos os TODOs
  const fetchTodos = async () => {
    try {
      const response = await axios.get(API_BASE_URL);
      setTodos(response.data);
    } catch (error) {
      console.error('Erro ao buscar todos:', error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // Adicionar novo TODO
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_BASE_URL, { title, description });
      setTitle('');
      setDescription('');
      fetchTodos();
    } catch (error) {
      console.error('Erro ao criar todo:', error);
    }
  };

  // Deletar TODO
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
      fetchTodos();
    } catch (error) {
      console.error('Erro ao deletar todo:', error);
    }
  };

  // Marcar como completo
  const handleToggleComplete = async (todo) => {
    try {
      await axios.put(`${API_BASE_URL}/${todo.id}`, {
        ...todo,
        completed: !todo.completed
      });
      fetchTodos();
    } catch (error) {
      console.error('Erro ao atualizar todo:', error);
    }
  };

  // Abrir diálogo de edição
  const handleOpenEdit = (todo) => {
    setEditingTodo(todo);
    setOpenDialog(true);
  };

  // Atualizar TODO
  const handleUpdate = async () => {
    try {
      await axios.put(`${API_BASE_URL}/${editingTodo.id}`, editingTodo);
      setOpenDialog(false);
      setEditingTodo(null);
      fetchTodos();
    } catch (error) {
      console.error('Erro ao atualizar todo:', error);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Lista de Tarefas
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            margin="normal"
          />
          <TextField
            fullWidth
            label="Descrição"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={3}
            margin="normal"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            Adicionar Tarefa
          </Button>
        </form>
      </Paper>

      <List>
        {todos.map((todo) => (
          <ListItem
            key={todo.id}
            sx={{
              mb: 1,
              bgcolor: 'background.paper',
              borderRadius: 1,
              boxShadow: 1
            }}
          >
            <Checkbox
              checked={todo.completed}
              onChange={() => handleToggleComplete(todo)}
            />
            <ListItemText
              primary={todo.title}
              secondary={todo.description}
              sx={{
                textDecoration: todo.completed ? 'line-through' : 'none'
              }}
            />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                aria-label="edit"
                onClick={() => handleOpenEdit(todo)}
                sx={{ mr: 1 }}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => handleDelete(todo.id)}
              >
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Editar Tarefa</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Título"
            value={editingTodo?.title || ''}
            onChange={(e) => setEditingTodo({ ...editingTodo, title: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Descrição"
            value={editingTodo?.description || ''}
            onChange={(e) => setEditingTodo({ ...editingTodo, description: e.target.value })}
            multiline
            rows={3}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button onClick={handleUpdate} color="primary">Salvar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default App;