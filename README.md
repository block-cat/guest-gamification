# BkC GGamification

![License](https://img.shields.io/badge/license-MIT-blue.svg) [![Latest Stable Version](https://img.shields.io/packagist/v/block-cat/guest-gamification.svg)](https://packagist.org/packages/block-cat/guest-gamification)

**Extensia nu este publicată pe [Packagist](https://packagist.org/)!**

Aceasta este o extensie [Flarum](https://flarum.org/) care oferă posibilitate utilizatorilor neînregistrați să voteze comentariile din articole.

Pentru ca oaspeții să poate aprecia comentariile trebuie ca, în panoul de administrare, în meniul `Permisiuni`, la rubrica `Participare`, valoarea permisiunii `Upvote/Downvote posts` trebuie setată la `Oricine`.

## Compatibilitate

Această extensie este compatibilă cu versiunea `1.2.1` de [Flarum](https://flarum.org/).

Extensia se bazează pe functionalitățile extensiei `fof/gamification`, însă, dacă aceasta din urmă nu este instalată, nu vor apărea careva erori în funcționarea sistemului.

## Instalare

Pentru instalarea extensiei trebuie executată următoarea comandă Composer:

```sh
composer require block-cat/guest-gamification *@dev
```

## Actualizare

Pentru actualizarea extensiei trebuie executată următoarea comandă Composer:

```sh
composer update block-cat/guest-gamification
php flarum cache:clear
```

## Dezinstalare

Pentru dezinstalarea extensiei trebuie executată următoarea comandă Composer:

```sh
composer remove block-cat/guest-gamification
php flarum cache:clear
```

## Link-uri utile

- [Cod sursă pe GitHub](https://github.com/block-cat/guest-gamification)
- [Changelog](CHANGELOG.md)