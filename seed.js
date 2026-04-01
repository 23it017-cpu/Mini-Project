require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Article = require('./models/Article');
const connectDB = require('./config/db');

const seedData = async () => {
    try {
        await connectDB();
        
        const adminExists = await User.findOne({ email: 'admin@newskrish.com' });
        
        if (adminExists) {
            console.log('Database already seeded!');
            process.exit();
            return;
        }

        console.log('Creating Admin Account...');
        const adminUser = await User.create({
            name: 'System Admin',
            email: 'admin@newskrish.com',
            password: 'admin123',
            profile_id: 'ADMIN001',
            department: 'Administration',
            role: 'admin'
        });

        console.log('Seeding Initial Articles...');
        await Article.create([
            {
                title: 'Major Tech Breakthrough in AI Energy Efficiency',
                content: 'In a monumental shift for the artificial intelligence landscape, a team of researchers has announced a new neural network architecture that could redefine how we power our future digital worlds.\n\nThe breakthrough, dubbed "GreenNeuro," utilizes a novel sparse-activation technique that mimics the human brain\'s efficiency. Unlike traditional models that activate every neuron for every task, GreenNeuro only powers up the specific pathways required for the current computation.\n\nAs AI integration becomes ubiquitous, the environmental cost of maintaining massive data centers has become a primary concern. Current estimations suggest that by 2030, AI-related energy consumption could rival that of medium-sized nations. This new architecture offers a path toward sustainable scaling.',
                category: 'technology',
                author: adminUser._id,
                views: 412,
                image_url: 'https://images.unsplash.com/photo-1585829365234-78ef2757c818?auto=format&fit=crop&q=80&w=1200'
            },
            {
                title: 'Placement Season Starts: Top Companies Expected',
                content: 'The university training and placement cell has announced the schedule for the upcoming recruitment drive featuring Fortune 500 companies including Google, Microsoft, and Amazon. Students are advised to keep their resumes updated and participate in the upcoming mock interview sessions.',
                category: 'placements',
                author: adminUser._id,
                views: 840,
                image_url: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=600'
            },
            {
                title: 'Inter-College Sports Meet Results Announced',
                content: 'The much awaited Inter-College Sports Meet concluded yesterday with our college securing the top rank in Athletics and Basketball. Congratulations to all the participants for their outstanding performance and bringing glory to our institution.',
                category: 'sports',
                author: adminUser._id,
                views: 56,
                image_url: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?auto=format&fit=crop&q=80&w=600'
            }
        ]);

        console.log('Setup Complete! Data has been imported.');
        process.exit();
    } catch (error) {
        console.error('Error with import:', error);
        process.exit(1);
    }
}

seedData();
