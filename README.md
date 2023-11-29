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
* Refactor Enemy.moveAlongPath()
* Refactor static value calculation from switch cases to config or lookup table
* Error handling
* Special gems
* Differentiate between waves & levels
* Handle Player death & level completion  
* Disallow gem placements that block the only path 

### DONE
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
* gem combining crashes after first placement phase
* white primitive gems are partly transparent