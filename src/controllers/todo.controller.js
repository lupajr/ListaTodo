import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createTodo = async (req, res) => {
    try {
        const { title, description } = req.body;
        const todo = await prisma.todo.create({
            data: {
                title,
                description,
            },
        });
        res.status(201).json(todo);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar todo' });
    }
};

export const getAllTodos = async (req, res) => {
    try {
        const todos = await prisma.todo.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        });
        res.json(todos);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar todos' });
    }
};

export const getTodoById = async (req, res) => {
    try {
        const { id } = req.params;
        const todo = await prisma.todo.findUnique({
            where: { id },
        });

        if (!todo) {
            return res.status(404).json({ error: 'Todo não encontrado' });
        }

        res.json(todo);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar todo' });
    }
};

export const updateTodo = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, completed } = req.body;

        const todo = await prisma.todo.update({
            where: { id },
            data: {
                title,
                description,
                completed,
            },
        });

        res.json(todo);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar todo' });
    }
};

export const deleteTodo = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.todo.delete({
            where: { id },
        });

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar todo' });
    }
};