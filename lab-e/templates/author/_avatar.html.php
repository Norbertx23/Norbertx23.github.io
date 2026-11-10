<?php
    // Wygenerowane claude opus 5.5

    /** @var \App\Model\Author $author */
?>
<?php if ($author->hasSafePhotoUrl()): ?>
    <span class="author-photo" data-credit="<?= htmlspecialchars($author->getPhotoCredit() ?: 'No photo credit') ?>">
        <img class="author-avatar" src="<?= htmlspecialchars($author->getPhotoUrl()) ?>" alt="<?= htmlspecialchars($author->getFullName()) ?>">
    </span>
<?php else: ?>
    <span class="author-avatar author-avatar-initials"><?= htmlspecialchars($author->getInitials()) ?></span>
<?php endif; ?>