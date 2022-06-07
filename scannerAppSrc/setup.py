from ssl import Options
from setuptools import setup

DATA_FILES = ['startScreen.ui','programRunningScreen.ui',"configScanner.ui","configDatabase.ui","configBuilding.ui","icon.icns"]

OPTIONS = {
    'iconfile':'icon.icns',
    'argv_emulation': True,
    'packages' : ['certifi']
}
setup(
    app=["main.py"],
    name="AnB Scanner",
    data_files = DATA_FILES,
    options={'p2app': OPTIONS},
    setup_requires=["py2app"],
)