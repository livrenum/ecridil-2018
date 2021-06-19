#rsync -vrz --exclude-from=exclude.deploy --delete site/ louis@demohybrilivre.loupbrun.ca:/var/www/demohybrilivre.loupbrun.ca/

# Surge.sh
surge ./site --domain livre-defi-design.arcanes.ca
