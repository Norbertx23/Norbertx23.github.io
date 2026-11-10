<?php

/** @var \App\Model\Post $post */
/** @var \App\Service\Router $router */

$title = "{$post->getSubject()} ({$post->getId()})";
$bodyClass = 'show';

ob_start(); ?>
    <h1><?= $post->getSubject() ?></h1>
    <?php $author = $post->getAuthor(); ?>
    <p class="post-author">
        Author:
        <?php if ($author): ?>
            <a href="<?= $router->generatePath('author-show', ['id' => $author->getId()]) ?>"><?= htmlspecialchars($author->getFullName()) ?></a>
        <?php else: ?>
            <em>none</em>
        <?php endif; ?>
    </p>
    <article>
        <?= $post->getContent();?>
    </article>

    <ul class="action-list">
        <li> <a href="<?= $router->generatePath('post-index') ?>">Back to list</a></li>
        <li><a href="<?= $router->generatePath('post-edit', ['id'=> $post->getId()]) ?>">Edit</a></li>
    </ul>
<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
