const express = require('express');
const { body, param, query, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Task = require('../models/Task');

const router = express.Router();

// Validation for task creation/update
const taskValidation = [
    body('title')
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('Title is required and cannot exceed 100 characters'),
    body('description')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Description cannot exceed 500 characters'),
    body('status')
        .optional()
        .isIn(['pending', 'in-progress', 'completed'])
        .withMessage('Invalid status value'),
    body('priority')
        .optional()
        .isIn(['low', 'medium', 'high'])
        .withMessage('Invalid priority value'),
    body('dueDate')
        .optional()
        .isISO8601()
        .withMessage('Invalid date format')
];

// @route   GET /api/tasks
// @desc    Get all tasks for current user (with search/filter)
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const { search, status, priority, sortBy = 'createdAt', order = 'desc' } = req.query;

        // Build query
        const queryObj = { user: req.user._id };

        // Filter by status
        if (status && ['pending', 'in-progress', 'completed'].includes(status)) {
            queryObj.status = status;
        }

        // Filter by priority
        if (priority && ['low', 'medium', 'high'].includes(priority)) {
            queryObj.priority = priority;
        }

        // Search in title and description
        if (search) {
            queryObj.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        // Build sort object
        const sortOrder = order === 'asc' ? 1 : -1;
        const sortObj = { [sortBy]: sortOrder };

        const tasks = await Task.find(queryObj).sort(sortObj);

        res.json({ tasks, count: tasks.length });
    } catch (error) {
        console.error('Get tasks error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/tasks/:id
// @desc    Get a single task by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, user: req.user._id });

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.json({ task });
    } catch (error) {
        console.error('Get task error:', error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/tasks
// @desc    Create a new task
// @access  Private
router.post('/', auth, taskValidation, async (req, res) => {
    try {
        // Check validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { title, description, status, priority, dueDate } = req.body;

        const task = new Task({
            user: req.user._id,
            title,
            description,
            status: status || 'pending',
            priority: priority || 'medium',
            dueDate
        });

        await task.save();

        res.status(201).json({
            message: 'Task created successfully',
            task
        });
    } catch (error) {
        console.error('Create task error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   PUT /api/tasks/:id
// @desc    Update a task
// @access  Private
router.put('/:id', auth, taskValidation, async (req, res) => {
    try {
        // Check validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { title, description, status, priority, dueDate } = req.body;

        // Find task and check ownership
        let task = await Task.findOne({ _id: req.params.id, user: req.user._id });

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Update fields
        if (title) task.title = title;
        if (description !== undefined) task.description = description;
        if (status) task.status = status;
        if (priority) task.priority = priority;
        if (dueDate) task.dueDate = dueDate;

        await task.save();

        res.json({
            message: 'Task updated successfully',
            task
        });
    } catch (error) {
        console.error('Update task error:', error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   DELETE /api/tasks/:id
// @desc    Delete a task
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error('Delete task error:', error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
