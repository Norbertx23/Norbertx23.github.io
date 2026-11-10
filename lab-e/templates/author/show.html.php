<?php

/** @var \App\Model\Author $author */
/** @var \App\Service\Router $router */

$title = htmlspecialchars($author->getFullName()) . " ({$author->getId()})";
$bodyClass = 'show author';

ob_start(); ?>
    <?php // Wygenerowane claude opus 5.5 ?>
    <div class="author-header">
        <?php require __DIR__ . DIRECTORY_SEPARATOR . '_avatar.html.php'; ?>
        <h1><?= htmlspecialchars($author->getFullName()) ?></h1>
    </div>
    <dl class="author-details">
        <dt>Email</dt>
        <dd><a href="mailto:<?= htmlspecialchars((string) $author->getEmail()) ?>"><?= htmlspecialchars((string) $author->getEmail()) ?></a></dd>

        <dt>Bio</dt>
        <dd class="author-bio"><?= $author->getBio() ? htmlspecialchars($author->getBio()) : '<em>No bio</em>' ?></dd>
    </dl>

    <ul class="action-list">
        <li> <a href="<?= $router->generatePath('author-index') ?>">Back to list</a></li>
        <li><a href="<?= $router->generatePath('author-edit', ['id'=> $author->getId()]) ?>">Edit</a></li>
    </ul>

    <?php // Wygenerowane claude opus 5.5 ?>
    <?php if ($author->hasSafePhotoUrl()): ?>
        <section class="author-photo-source">
            <h4>Photo source</h4>
            <p><?= $author->getPhotoCredit() ? htmlspecialchars($author->getPhotoCredit()) : '<em>No photo credit</em>' ?></p>
            <p><a href="<?= htmlspecialchars($author->getPhotoUrl()) ?>" target="_blank" rel="noopener"><?= htmlspecialchars($author->getPhotoUrl()) ?></a></p>
        </section>
    <?php endif; ?>
<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';