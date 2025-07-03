import {
	View,
	Text,
	Alert,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	TextInput,
	TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { useSignUp } from "@clerk/clerk-expo";
import { useState } from "react";
import { authStyles } from "../../assets/styles/auth.styles.js";
import { Image } from "expo-image";
import { COLORS } from "../../constants/colors.js";
import { Ionicons } from "@expo/vector-icons";
import VerifyEmail from "./verify-email.jsx";

const SignUpScreen = () => {
	const router = useRouter();

	const { signUp, isLoaded } = useSignUp();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const [pendingVerification, setPendingVerification] = useState(false);

	const handleSignUp = async () => {
		if (!email || !password) {
			Alert.alert("Error, Please fill in all details");
		}
		if (password.length < 6) {
			Alert.alert("Error, Password must be at lease 6 characters");
		}

		if (!isLoaded) return;

		setLoading(true);

		try {
			await signUp.create({
				emailAddress: email,
				password: password,
			});

			await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

			setPendingVerification(true);
		} catch (err) {
			Alert.alert(
				"Error",
				err.errors?.[0]?.message || "Failed to create account"
			);
			console.error(JSON.stringify(err, null, 2));
		} finally {
			setLoading(false);
		}
	};

	if (pendingVerification)
		return (
			<VerifyEmail email={email} onBack={() => setPendingVerification(false)} />
		);

	return (
		<View style={authStyles.container}>
			<KeyboardAvoidingView
				style={authStyles.keyboardView}
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
			>
				<ScrollView
					contentContainerStyle={authStyles.scrollContent}
					showsVerticalScrollIndicator={false}
				>
					<View style={authStyles.imageContainer}>
						<Image
							source={require("../../assets/images/i2.png")}
							style={authStyles.image}
							contentFit="contain"
						/>
					</View>
					<Text style={authStyles.title}>Create account</Text>

					{/* Form Container */}
					<View style={authStyles.formContainer}>
						{/* Email */}
						<View style={authStyles.inputContainer}>
							<TextInput
								style={authStyles.textInput}
								placeholder="Enter Email"
								placeholderTextColor={COLORS.textLight}
								value={email}
								onChangeText={setEmail}
								keyboardType="email-address"
								autoCapitalize="none"
							/>
						</View>
						{/* Password */}
						<View style={authStyles.inputContainer}>
							<TextInput
								style={authStyles.textInput}
								placeholder="Enter password"
								placeholderTextColor={COLORS.textLight}
								value={password}
								onChangeText={setPassword}
								secureTextEntry={!showPassword}
								autoCapitalize="none"
							/>
							<TouchableOpacity
								style={authStyles.eyeButton}
								onPress={() => setShowPassword(!showPassword)}
							>
								<Ionicons
									name={showPassword ? "eye-outline" : "eye-off-outline"}
									size={20}
									color={COLORS.textLight}
								/>
							</TouchableOpacity>
						</View>

						<TouchableOpacity
							style={[
								authStyles.authButton,
								loading && authStyles.buttonDisabled,
							]}
							onPress={handleSignUp}
							disabled={loading}
							activeOpacity={0.8}
						>
							<Text style={authStyles.buttonText}>
								{" "}
								{loading ? "Creating Account..." : "Sign Up"}{" "}
							</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={authStyles.linkContainer}
							onPress={() => router.back()}
						>
							<Text style={authStyles.linkText}>
								Already have an account?{" "}
								<Text style={authStyles.link}>Sign in</Text>
							</Text>
						</TouchableOpacity>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</View>
	);
};

export default SignUpScreen;
