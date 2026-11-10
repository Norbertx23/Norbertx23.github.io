<?php
namespace App\Model;

use App\Service\Config;

class Author
{
    private ?int $id = null;
    private ?string $firstName = null;
    private ?string $lastName = null;
    private ?string $email = null;
    private ?string $bio = null;
    private ?string $photoUrl = null;
    private ?string $photoCredit = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(?int $id): Author
    {
        $this->id = $id;

        return $this;
    }

    public function getFirstName(): ?string
    {
        return $this->firstName;
    }

    public function setFirstName(?string $firstName): Author
    {
        $this->firstName = $firstName;

        return $this;
    }

    public function getLastName(): ?string
    {
        return $this->lastName;
    }

    public function setLastName(?string $lastName): Author
    {
        $this->lastName = $lastName;

        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(?string $email): Author
    {
        $this->email = $email;

        return $this;
    }

    public function getBio(): ?string
    {
        return $this->bio;
    }

    public function setBio(?string $bio): Author
    {
        $this->bio = $bio;

        return $this;
    }

    public function getPhotoUrl(): ?string
    {
        return $this->photoUrl;
    }

    public function setPhotoUrl(?string $photoUrl): Author
    {
        $this->photoUrl = $photoUrl;

        return $this;
    }

    public function getPhotoCredit(): ?string
    {
        return $this->photoCredit;
    }

    public function setPhotoCredit(?string $photoCredit): Author
    {
        $this->photoCredit = $photoCredit;

        return $this;
    }

    // Wygenerowane claude opus 5.5
    public function getFullName(): string
    {
        return trim("{$this->getFirstName()} {$this->getLastName()}");
    }

    // Wygenerowane claude opus 5.5
    public function hasSafePhotoUrl(): bool
    {
        $url = $this->getPhotoUrl();

        return $url
            && filter_var($url, FILTER_VALIDATE_URL)
            && preg_match('#^https?://#i', $url);
    }

    // Wygenerowane claude opus 5.5
    public function getInitials(): string
    {
        $initials = mb_substr($this->getFirstName() ?? '', 0, 1) . mb_substr($this->getLastName() ?? '', 0, 1);

        return mb_strtoupper($initials);
    }

    public static function fromArray($array): Author
    {
        $author = new self();
        $author->fill($array);

        return $author;
    }

    // Wygenerowane claude opus 5.5
    public function fill($array): Author
    {
        if (isset($array['id']) && ! $this->getId()) {
            $this->setId($array['id']);
        }
        if (isset($array['first_name'])) {
            $this->setFirstName($array['first_name']);
        }
        if (isset($array['last_name'])) {
            $this->setLastName($array['last_name']);
        }
        if (isset($array['email'])) {
            $this->setEmail($array['email']);
        }
        if (isset($array['bio'])) {
            $this->setBio($array['bio']);
        }
        if (isset($array['photo_url'])) {
            $this->setPhotoUrl($array['photo_url']);
        }
        if (isset($array['photo_credit'])) {
            $this->setPhotoCredit($array['photo_credit']);
        }

        return $this;
    }

    public static function findAll(): array
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM author';
        $statement = $pdo->prepare($sql);
        $statement->execute();

        $authors = [];
        $authorsArray = $statement->fetchAll(\PDO::FETCH_ASSOC);
        foreach ($authorsArray as $authorArray) {
            $authors[] = self::fromArray($authorArray);
        }

        return $authors;
    }

    public static function find($id): ?Author
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM author WHERE id = :id';
        $statement = $pdo->prepare($sql);
        $statement->execute(['id' => $id]);

        $authorArray = $statement->fetch(\PDO::FETCH_ASSOC);
        if (! $authorArray) {
            return null;
        }
        $author = Author::fromArray($authorArray);

        return $author;
    }

    public function save(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        if (! $this->getId()) {
            $sql = "INSERT INTO author (first_name, last_name, email, bio, photo_url, photo_credit) VALUES (:first_name, :last_name, :email, :bio, :photo_url, :photo_credit)";
            $statement = $pdo->prepare($sql);
            $statement->execute([
                'first_name' => $this->getFirstName(),
                'last_name' => $this->getLastName(),
                'email' => $this->getEmail(),
                'bio' => $this->getBio(),
                'photo_url' => $this->getPhotoUrl(),
                'photo_credit' => $this->getPhotoCredit(),
            ]);

            $this->setId($pdo->lastInsertId());
        } else {
            $sql = "UPDATE author SET first_name = :first_name, last_name = :last_name, email = :email, bio = :bio, photo_url = :photo_url, photo_credit = :photo_credit WHERE id = :id";
            $statement = $pdo->prepare($sql);
            $statement->execute([
                ':first_name' => $this->getFirstName(),
                ':last_name' => $this->getLastName(),
                ':email' => $this->getEmail(),
                ':bio' => $this->getBio(),
                ':photo_url' => $this->getPhotoUrl(),
                ':photo_credit' => $this->getPhotoCredit(),
                ':id' => $this->getId(),
            ]);
        }
    }

    public function delete(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $statement = $pdo->prepare("UPDATE post SET author_id = NULL WHERE author_id = :id");
        $statement->execute([
            ':id' => $this->getId(),
        ]);

        $sql = "DELETE FROM author WHERE id = :id";
        $statement = $pdo->prepare($sql);
        $statement->execute([
            ':id' => $this->getId(),
        ]);

        $this->setId(null);
        $this->setFirstName(null);
        $this->setLastName(null);
        $this->setEmail(null);
        $this->setBio(null);
        $this->setPhotoUrl(null);
        $this->setPhotoCredit(null);
    }
}
