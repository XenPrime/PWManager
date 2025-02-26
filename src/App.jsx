import React, { useState, useEffect } from 'react'
import styled from '@emotion/styled'

const Container = styled.div`
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  background-color: ${props => props.isDarkMode ? '#1a1a1a' : '#ffffff'};
  min-height: 100vh;
  color: ${props => props.primaryColor};
`

const Title = styled.h1`
  color: ${props => props.primaryColor};
  text-align: center;
  margin-bottom: 2rem;
`

const Card = styled.div`
  background: ${props => props.isDarkMode ? '#2a2a2a' : '#f5f5f5'};
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  margin-bottom: 2rem;
  border: 1px solid ${props => props.primaryColor};

  h2 {
    color: ${props => props.primaryColor};
  }
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid ${props => props.primaryColor};
  border-radius: 4px;
  font-size: 1rem;
  background: ${props => props.isDarkMode ? '#333' : '#ffffff'};
  color: ${props => props.primaryColor};

  &::placeholder {
    color: ${props => props.primaryColor}99;
  }

  &:focus {
    outline: none;
    border-color: ${props => props.primaryColor};
    box-shadow: 0 0 0 2px ${props => props.primaryColor}33;
  }
`

const Button = styled.button`
  padding: 0.75rem;
  background: ${props => props.primaryColor};
  color: #000;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.primaryColor}CC;
    color: #fff;
  }
`

const PasswordList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const PasswordItem = styled.div`
  padding: 1rem;
  background: ${props => props.isDarkMode ? '#333' : '#f0f0f0'};
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid ${props => props.primaryColor};
`

const StrengthIndicator = styled.div`
  height: 5px;
  border-radius: 2.5px;
  margin-top: 0.5rem;
  background: ${props => {
    if (props.strength === 'strong') return '#4CAF50';
    if (props.strength === 'medium') return '#FFC107';
    return '#f44336';
  }};
`

const OptionsContainer = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1rem;
  padding: 1rem;
  background: ${props => props.isDarkMode ? '#333' : '#f0f0f0'};
  border-radius: 4px;
  border: 1px solid ${props => props.primaryColor};
  color: ${props => props.primaryColor};
`

const Checkbox = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  color: ${props => props.color};

  input[type="checkbox"] {
    accent-color: ${props => props.accentColor};
  }
`

const LengthInput = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  input[type="number"] {
    width: 70px;
    padding: 0.25rem;
    border: 1px solid ${props => props.borderColor};
    border-radius: 4px;
    background: #333;
    color: ${props => props.color};
  }
`

const PasswordInputContainer = styled.div`
  position: relative;
  display: flex;
  gap: 0.5rem;
`

const ShowPasswordButton = styled.button`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: ${props => props.color};
  padding: 5px;
  font-size: 0.9rem;

  &:hover {
    color: ${props => props.primaryColor}CC;
  }
`

const SettingsCard = styled(Card)`
  margin-top: 2rem;
`

const ColorPicker = styled.input`
  width: 100%;
  height: 40px;
  padding: 5px;
  border: 1px solid ${props => props.primaryColor};
  border-radius: 4px;
  background: #333;
  cursor: pointer;
`

// Add new styled components for theme toggle
const ThemeToggle = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
`

const ToggleButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: 1px solid ${props => props.primaryColor};
  background: ${props => props.isActive ? props.primaryColor : 'transparent'};
  color: ${props => props.isActive ? (props.isDarkMode ? '#1a1a1a' : '#ffffff') : props.primaryColor};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.primaryColor}99;
  }
`

const SettingsSection = styled.div`
  margin-bottom: 2rem;
  
  h3 {
    color: ${props => props.primaryColor};
    margin-bottom: 1rem;
  }
`

// Use a safer way to import electron
const electron = window.require ? window.require('electron') : { ipcRenderer: null };
const ipcRenderer = electron.ipcRenderer;

function App() {
  const [formData, setFormData] = useState({
    website: '',
    username: '',
    password: ''
  });
  const [passwords, setPasswords] = useState([]);
  const [passwordStrength, setPasswordStrength] = useState('weak');
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [passwordLength, setPasswordLength] = useState(12);
  const [showPassword, setShowPassword] = useState(false);
  const [primaryColor, setPrimaryColor] = useState('#FFD700'); // Default gold color
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark mode

  // Load passwords and settings from electron-store on startup
  useEffect(() => {
    ipcRenderer.send('load-passwords');
    ipcRenderer.send('load-settings');
    
    ipcRenderer.on('passwords-loaded', (event, loadedPasswords) => {
      setPasswords(loadedPasswords || []);
    });
    
    ipcRenderer.on('settings-loaded', (event, settings) => {
      if (settings) {
        if (settings.primaryColor) {
          setPrimaryColor(settings.primaryColor);
        }
        if (typeof settings.isDarkMode !== 'undefined') {
          setIsDarkMode(settings.isDarkMode);
        }
      }
    });

    return () => {
      ipcRenderer.removeAllListeners('passwords-loaded');
      ipcRenderer.removeAllListeners('settings-loaded');
    };
  }, []);

  const saveSettings = (newColor, newTheme) => {
    const updatedSettings = {
      primaryColor: newColor || primaryColor,
      isDarkMode: typeof newTheme !== 'undefined' ? newTheme : isDarkMode
    };
    setPrimaryColor(updatedSettings.primaryColor);
    setIsDarkMode(updatedSettings.isDarkMode);
    ipcRenderer.send('save-settings', updatedSettings);
  };

  const checkPasswordStrength = (password) => {
    let strength = 'weak';
    if (password.length >= 8) {
      if (/[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password)) {
        strength = 'strong';
      } else if (/[A-Z]/.test(password) || /[0-9]/.test(password)) {
        strength = 'medium';
      }
    }
    return strength;
  };

  const generatePassword = () => {
    const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    let chars = letters + numbers;
    if (includeSymbols) chars += symbols;

    let password = '';
    for (let i = 0; i < passwordLength; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    // Ensure at least one number and uppercase letter for strength
    if (!/\d/.test(password)) {
      const pos = Math.floor(Math.random() * passwordLength);
      password = password.substring(0, pos) + 
                numbers.charAt(Math.floor(Math.random() * numbers.length)) + 
                password.substring(pos + 1);
    }
    if (!/[A-Z]/.test(password)) {
      const pos = Math.floor(Math.random() * passwordLength);
      password = password.substring(0, pos) + 
                'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.charAt(Math.floor(Math.random() * 26)) + 
                password.substring(pos + 1);
    }

    setFormData({ ...formData, password });
    setPasswordStrength(checkPasswordStrength(password));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.website && formData.username && formData.password) {
      const newPassword = { ...formData, id: Date.now() };
      const updatedPasswords = [...passwords, newPassword];
      setPasswords(updatedPasswords);
      ipcRenderer.send('save-passwords', updatedPasswords);
      setFormData({ website: '', username: '', password: '' });
      setPasswordStrength('weak');
    }
  };

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setFormData({ ...formData, password });
    setPasswordStrength(checkPasswordStrength(password));
  };

  const handleDelete = (id) => {
    const updatedPasswords = passwords.filter(pwd => pwd.id !== id);
    setPasswords(updatedPasswords);
    ipcRenderer.send('save-passwords', updatedPasswords);
  };

  return (
    <Container primaryColor={primaryColor} isDarkMode={isDarkMode}>
      <Title primaryColor={primaryColor}>Password Manager</Title>
      
      <Card primaryColor={primaryColor} isDarkMode={isDarkMode}>
        <h2>Add New Password</h2>
        <Form onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Website"
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            primaryColor={primaryColor}
            isDarkMode={isDarkMode}
          />
          <Input
            type="text"
            placeholder="Username/Email"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            primaryColor={primaryColor}
            isDarkMode={isDarkMode}
          />
          <PasswordInputContainer>
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={formData.password}
              onChange={handlePasswordChange}
              style={{ width: '100%' }}
              primaryColor={primaryColor}
              isDarkMode={isDarkMode}
            />
            <ShowPasswordButton
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{ color: primaryColor }}
            >
              {showPassword ? "Hide" : "Show"}
            </ShowPasswordButton>
          </PasswordInputContainer>
          <StrengthIndicator strength={passwordStrength} />
          
          <OptionsContainer primaryColor={primaryColor} isDarkMode={isDarkMode}>
            <Checkbox>
              <input
                type="checkbox"
                checked={includeSymbols}
                onChange={(e) => setIncludeSymbols(e.target.checked)}
                style={{ accentColor: primaryColor }}
              />
              Include Symbols
            </Checkbox>
            <LengthInput>
              <span>Length:</span>
              <input
                type="number"
                min="8"
                max="32"
                value={passwordLength}
                onChange={(e) => setPasswordLength(Math.max(8, Math.min(32, parseInt(e.target.value) || 8)))}
                style={{ borderColor: primaryColor, color: primaryColor }}
              />
            </LengthInput>
          </OptionsContainer>

          <Button type="button" onClick={generatePassword} primaryColor={primaryColor}>
            Generate Strong Password
          </Button>
          <Button type="submit" primaryColor={primaryColor}>Save Password</Button>
        </Form>
      </Card>

      <Card primaryColor={primaryColor} isDarkMode={isDarkMode}>
        <h2>Saved Passwords</h2>
        <PasswordList>
          {passwords.map(pwd => (
            <PasswordItem key={pwd.id} primaryColor={primaryColor} isDarkMode={isDarkMode}>
              <div>
                <strong>{pwd.website}</strong>
                <div>{pwd.username}</div>
                <div style={{ fontFamily: 'monospace' }}>
                  {showPassword ? pwd.password : '••••••••'}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Button onClick={() => handleDelete(pwd.id)} primaryColor={primaryColor}>Delete</Button>
              </div>
            </PasswordItem>
          ))}
          {passwords.length === 0 && (
            <div style={{ textAlign: 'center', color: primaryColor }}>
              No passwords saved yet
            </div>
          )}
        </PasswordList>
      </Card>

      <SettingsCard primaryColor={primaryColor} isDarkMode={isDarkMode}>
        <h2>Settings</h2>
        
        <SettingsSection primaryColor={primaryColor}>
          <h3>Theme</h3>
          <ThemeToggle>
            <ToggleButton
              onClick={() => saveSettings(primaryColor, true)}
              isActive={isDarkMode}
              primaryColor={primaryColor}
              isDarkMode={isDarkMode}
            >
              Dark
            </ToggleButton>
            <ToggleButton
              onClick={() => saveSettings(primaryColor, false)}
              isActive={!isDarkMode}
              primaryColor={primaryColor}
              isDarkMode={isDarkMode}
            >
              Light
            </ToggleButton>
          </ThemeToggle>
        </SettingsSection>

        <SettingsSection primaryColor={primaryColor}>
          <h3>Accent Color</h3>
          <ColorPicker
            type="color"
            value={primaryColor}
            onChange={(e) => saveSettings(e.target.value)}
            primaryColor={primaryColor}
          />
        </SettingsSection>
      </SettingsCard>
    </Container>
  );
}

export default App 