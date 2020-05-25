const express = require("express");
const cors = require("cors");
const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());


const repositories = [];

app.get("/repositories", (request, response) => {
  return response.status(200).json(repositories); 
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository ={
    id: uuid(),
    url,
    title,
    techs,
    likes: 0
  };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const {id} = request.params;
  
  const repositoryIndex = repositories.findIndex(repo => repo.id === id);

  if(repositoryIndex < 0){
    return response.status(400).json({ errro: "Repository does not exists." });
  }

  const { title, url, techs, likes } = request.body;

  if (likes) {
    return response.send({
      likes: repositories[repositoryIndex].likes,
    });
  }

  repositories[repositoryIndex].title = title;
  repositories[repositoryIndex].url = url;
  repositories[repositoryIndex].techs = techs;

  return response.status(200).json(repositories[repositoryIndex]);

});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params;

  const repositoryIndex = repositories.findIndex(repo => repo.id === id);

  if(repositoryIndex < 0){
    return response.status(400).json({ errro: "Repository does not exists." });
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const {id} = request.params;
  
  const repositoryIndex = repositories.findIndex(repo => repo.id === id);

  if(repositoryIndex < 0){
    return response.status(400).json({ errro: "Repository does not exists." });
  }

  repositories[repositoryIndex].likes ++;

  return response.json({likes: repositories[repositoryIndex].likes});
   
});

module.exports = app;
