<?php
namespace App\Controller;

use App\Exception\NotFoundException;
use App\Model\Author;
use App\Service\Router;
use App\Service\Templating;

class AuthorController
{
    public function indexAction(Templating $templating, Router $router): ?string
    {
        $authors = Author::findAll();
        $html = $templating->render('author/index.html.php', [
            'authors' => $authors,
            'router' => $router,
        ]);
        return $html;
    }

    public function createAction(?array $requestAuthor, Templating $templating, Router $router): ?string
    {
        if ($requestAuthor) {
            $author = Author::fromArray($requestAuthor);
            $author->save();

            $path = $router->generatePath('author-index');
            $router->redirect($path);
            return null;
        } else {
            $author = new Author();
        }

        $html = $templating->render('author/create.html.php', [
            'author' => $author,
            'router' => $router,
        ]);
        return $html;
    }

    public function editAction(int $authorId, ?array $requestAuthor, Templating $templating, Router $router): ?string
    {
        $author = Author::find($authorId);
        if (! $author) {
            throw new NotFoundException("Missing author with id $authorId");
        }

        if ($requestAuthor) {
            $author->fill($requestAuthor);
            $author->save();

            $path = $router->generatePath('author-index');
            $router->redirect($path);
            return null;
        }

        $html = $templating->render('author/edit.html.php', [
            'author' => $author,
            'router' => $router,
        ]);
        return $html;
    }

    public function showAction(int $authorId, Templating $templating, Router $router): ?string
    {
        $author = Author::find($authorId);
        if (! $author) {
            throw new NotFoundException("Missing author with id $authorId");
        }

        $html = $templating->render('author/show.html.php', [
            'author' => $author,
            'router' => $router,
        ]);
        return $html;
    }

    public function deleteAction(int $authorId, Router $router): ?string
    {
        $author = Author::find($authorId);
        if (! $author) {
            throw new NotFoundException("Missing author with id $authorId");
        }

        $author->delete();
        $path = $router->generatePath('author-index');
        $router->redirect($path);
        return null;
    }
}