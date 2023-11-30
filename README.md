# Defend the Seven Hells

## Concept
"Defend the Seven Hells" is a tower defense game in which you try to defend the seven hells from humanity. The hells are the last place humans have not settled yet and we want to keep it that way.  
Each round, you get to place 7 gems and keep one of them.  
Each gem you did not keep for the round turns into a wall, so try to build a maze.  
You can combine three or more gems into special gems with cool abilites.  

### The different gems that are available are:
* White (Diamond): ...
* Yellow (Topaz): ...
* Red (Ruby): ...
* Pink (Amethyst): ...
* Blue (Sapphire): ...
* Cyan (Aquamarine): ...
* Black (Opal): ...  
### Gems can have 7 different rarities:
* Glowing (Primitive)
* Fiery (Common)
* Infernal (Uncommon)
* Hellforged (Rare)
* Demonic (Epic)
* Abyssal (Legendary)
* Diabolical (Mythic)  

## TODOs
### TECHNICAL TODOS
* Special gems
* Handle Player death & level completion  
* Refactor Enemy.moveAlongPath()
* Error handling  
  
### ART TODOS
* new enemy sprites
* fix visibility for gems
* rework path tiles
* rework checkpoint sprite
* UI background image
* music & sounds

### DONE
* Disallow gem placements that block the only path
* Differentiate between waves & levels
* Refactor static value calculation from switch cases to config or lookup table
* Gem hover effect while in placement effect. Grid removed.
* Combining gems
* simple, but robust A* implementation using a list of checkpoints
* enemy class as an extension of phaser's sprite class with a moveAlongPath function
* ability for the player to place rocks on empty tiles 
* let player place turrets -> not on checkpoints
* actually check for walls in A*
* let turrets shoot things
* generate embers for kills
* introduce rarity system  
  
## KNOWN BUGS
* beating the last level crashes the game
* sometimes, shots get caught and the projectile isn't destroyed
* white primitive gems are partly transparent