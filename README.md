# Matterport Workshop Project
___

## Software and Package Requirements

Ensure the following software is installed on your machine:

- **Visual Studio Code**  
  [Download Link](https://code.visualstudio.com/download)

- **Node.js** (Any version should work)  
  [Download Link](https://nodejs.org/en/download/prebuilt-installer)

- **Git**  
  [Download Link](https://git-scm.com/downloads/win)

## Check Installation Status

1. **Open Command Prompt** on Windows.
2. Run the following commands:
   - **Check Visual Studio Code**  
     ```bash
     code -v
     ```
     - You should see the version number of Visual Studio Code.
   - **Check Node.js**  
     ```bash
     node -v
     ```
     - You should see the version number of Node.js.
   - **Check Git**  
     ```bash
     git -v
     ```
     - You should see the version number of Git.

   If all three commands return version numbers, your installations were successful.

---

## Cloning the Repository

1. Navigate to the folder in your directory where you want to clone the project. Ensure there are no folder restrictions.
2. In the folder's path bar, type `cmd` and press Enter.
   - A new terminal instance will open at that location.
3. Copy the repository URL.
4. In the terminal, run the following command to clone the repository:
   ```bash
   git clone https://github.com/nbbj-digital/matterport-workshop.git
   ```
5. Navigate to the folder:
   ```bash
   cd matterport-workshop
   ```
6. Launch VSCode at the folder location:
   ```bash
   code .
   ```

---

# Setting up Matterport SDK Key

## Steps to Set Up Matterport SDK Key

1. **Sign up for a Matterport account using your phone**  
   The web URL for signup may be broken. Use this link: [Matterport Signup](https://authn.matterport.com/login?target=https%3A%2F%2Fmy.matterport.com)
   
2. **Log in to Matterport**  
   After logging in, navigate to **Settings** -> **Developer Settings**.
   
  ![image](https://github.com/user-attachments/assets/b029b8d2-fa84-4871-9b28-4d110fc38570)
   
4. **SDK Key Management**  
   Scroll down to the **SDK Key Management** section.

5. **Add a new SDK Key**  
   Click the **+ Add an SDK Key** button.

6. **Name your SDK Key**  
   Use the name `localhost` for local development.

7. **Generate the SDK Key**  
   Once named, generate the key and keep it handy for the next steps.

---
8. **Add port name**
   Once SDK key is generated, Click 'Edit' and add 5173 Port. Click Update
   
![image](https://github.com/user-attachments/assets/9eedc8ee-20f8-43e4-9aae-41bb25dcdf2b)
   

# Setting up the Project

1. **Open Terminal in VSCode**  
   Navigate to **Terminal** -> **New Terminal** to open a terminal at the folder location.

2. **Navigate to the `index.html` file**  
   On **line 26**, replace the placeholder `"sdk-key"` with your generated SDK key.
   
![image](https://github.com/user-attachments/assets/2f585a17-9e45-4fb1-846a-539c47f9df54)

4. **Install dependencies**  
   Run the following command to install all necessary packages:
   ```bash
   npm install
   ```
   ```bash
   npx matterport-assets static
   ```
   - You should see the version number of Node.js.
     
   ```bash
   npm run dev
   ```
5. **Launch the app**  
   Ctrl-click on the link "http://localhost:5173/" in the terminal to launch the app
   
   ![image](https://github.com/user-attachments/assets/817f5cc3-6257-455d-83d8-b8948e4e0671)

7. **Go to the lobby**  
   Once the app loads, click on the **“Go to lobby”** button located at the top of the page.

8. **Verify the app functionality**  
   If the view switches, your app is working correctly!


