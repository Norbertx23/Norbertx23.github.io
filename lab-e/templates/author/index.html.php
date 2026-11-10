<?php

/** @var \App\Model\Author[] $authors */
/** @var \App\Service\Router $router */

$title = 'Author List';
$bodyClass = 'index author';

ob_start(); ?>
    <h1>Authors List</h1>

    <a href="<?= $router->generatePath('author-create') ?>">Create new</a>

    <ul class="index-list">
        <?php foreach ($authors as $author): ?>
            <?php // Wygenerowane claude opus 5.5 ?>
            <li>
                <?php require __DIR__ . DIRECTORY_SEPARATOR . '_avatar.html.php'; ?>
                <div class="author-card-body">
                    <h3><?= htmlspecialchars($author->getFullName()) ?></h3>
                    <p class="author-email"><?= htmlspecialchars((string) $author->getEmail()) ?></p>
                    <ul class="action-list">
                        <li><a href="<?= $router->generatePath('author-show', ['id' => $author->getId()]) ?>">Details</a></li>
                        <li><a href="<?= $router->generatePath('author-edit', ['id' => $author->getId()]) ?>">Edit</a></li>
                    </ul>
                </div>
            </li>
        <?php endforeach; ?>
    </ul>

<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';