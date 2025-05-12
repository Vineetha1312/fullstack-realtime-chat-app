#!/bin/bash
set -e

echo "Installing backend dependencies..."
cd backend
npm ci

echo "Installing frontend dependencies..."
cd ../frontend
npm ci
npm audit fix

echo "Building frontend..."
npm run build