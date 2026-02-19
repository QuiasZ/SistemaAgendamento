import axios from 'axios';

// ATENÇÃO: Substitua o 5189 pela porta exata que aparece no terminal do seu C#
export const api = axios.create({
  baseURL: 'http://localhost:5069/api',
});